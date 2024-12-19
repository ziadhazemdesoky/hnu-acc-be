import { Request, RequestHandler, Response } from "express";
import moment from "moment";
import puppeteer from "puppeteer";
import path from "path";
import { compile } from "handlebars";
import fs from "fs/promises";
import { OperationRecord } from "../models/OperationRecord";
import { getStringQueryParam } from "../utils/queryParam";

// Utility to Convert Logo to Base64
const encodeBase64 = async (filePath: string): Promise<string> => {
  const fileBuffer = await fs.readFile(filePath);
  return `data:image/png;base64,${fileBuffer.toString("base64")}`;
};

export const generateReport: RequestHandler = async (req: Request, res: Response): Promise<void> => {
  try {
    const operationMakerId = getStringQueryParam(req.query.operationMakerId);
    const startDateStr = getStringQueryParam(req.query.startDate);
    const endDateStr = getStringQueryParam(req.query.endDate);

    if (!operationMakerId || !startDateStr || !endDateStr) {
      res.status(400).json({ message: "Missing required query parameters." });
      return;
    }

    const startDate = moment(startDateStr, "YYYY-MM-DD", true);
    const endDate = moment(endDateStr, "YYYY-MM-DD", true);

    if (!startDate.isValid() || !endDate.isValid() || startDate.isAfter(endDate)) {
      res.status(400).json({ message: "Invalid date range." });
      return;
    }

    const records = await OperationRecord.find({
      status: "approved",
      operationMaker: operationMakerId,
      createdAt: { $gte: startDate.toDate(), $lte: endDate.toDate() },
    })
      .populate("operationCode")
      .populate("operationMaker")
      .lean();

    if (records.length === 0) {
      res.status(404).json({ message: "No approved records found." });
      return;
    }

    const operationMaker = records[0].operationMaker;
    const totalCredit = records.reduce((sum, record) => sum + (record.creditorBalance || 0), 0);
    const totalDebit = records.reduce((sum, record) => sum + (record.debitorBalance || 0), 0);

    const templatePath = path.join(__dirname, "../templates/reportTemplate.hbs");
    const templateSource = await fs.readFile(templatePath, "utf-8");
    const template = compile(templateSource);

    const logoPath = path.join(__dirname, "../assets/logo.png");
    const logoBase64 = await encodeBase64(logoPath);

    const html = template({
      logo: logoBase64,
      operationMaker,
      startDate: startDate.format("YYYY-MM-DD"),
      endDate: endDate.format("YYYY-MM-DD"),
      records,
      totalCredit: totalCredit.toLocaleString("ar-EG"),
      totalDebit: totalDebit.toLocaleString("ar-EG"),
    });

    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.setContent(html, { waitUntil: "load" });

    const pdfBuffer = await page.pdf({ format: "A4" });
    await browser.close();

    res.setHeader("Content-Type", "application/pdf");
    res.setHeader(
      "Content-Disposition",
      `attachment; filename="approved_records_${moment().format("YYYYMMDD_HHmmss")}.pdf"`
    );

    res.end(pdfBuffer);
  } catch (error) {
    console.error("Error generating PDF report:", error);
    res.status(500).json({ message: "Internal server error." });
  }
};
