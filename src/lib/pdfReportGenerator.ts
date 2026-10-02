import jsPDF from 'jspdf';
import { CalendarPlanItem } from './calendarPlan2026Data';

export interface StudentResultItem {
  id?: string | number;
  studentName?: string;
  rollNo?: string;
  exam?: string;
  examName?: string;
  category?: string;
  marksScored?: number;
  score?: number;
  totalMarks?: number;
  total?: number;
  percentage?: number;
  rank?: string | number;
  status?: string;
  date?: string;
}

/**
 * Downloads a beautifully styled PDF performance report for a student
 */
export function downloadStudentMarksPdf(
  results: StudentResultItem[],
  studentInfo: { name: string; rollNo?: string; mobile?: string } = { name: 'Alex Johnson', rollNo: 'AGM-2024-042' }
) {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4'
  });

  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();

  // 1. Header Banner & Theme Colors
  // Navy Header
  doc.setFillColor(15, 23, 42); // slate-900
  doc.rect(0, 0, pageWidth, 42, 'F');

  // Gold Accent Strip
  doc.setFillColor(217, 119, 6); // amber-600
  doc.rect(0, 42, pageWidth, 2.5, 'F');

  // Academy Name
  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(18);
  doc.text('AGAMAKIZH IAS ACADEMY', 14, 18);

  // Subtitle
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.5);
  doc.setTextColor(203, 213, 225); // slate-300
  doc.text('Premier Academy for TNPSC, UPSC, SSC & Railway Civil Services Examinations', 14, 25);
  doc.text('Official Examination Division • Performance Analytics & Assessment Wing', 14, 31);

  // Date and Badge on Right
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8);
  doc.setTextColor(251, 191, 36); // amber-400
  doc.text('OFFICIAL TRANSCRIPT', pageWidth - 14, 18, { align: 'right' });
  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'normal');
  const todayStr = new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
  doc.text(`Generated: ${todayStr}`, pageWidth - 14, 25, { align: 'right' });
  doc.text(`Report ID: AGM-RPT-${Date.now().toString().slice(-6)}`, pageWidth - 14, 31, { align: 'right' });

  // 2. Candidate Information Card
  let currentY = 52;
  doc.setFillColor(248, 250, 252); // slate-50
  doc.setDrawColor(226, 232, 240); // slate-200
  doc.roundedRect(14, currentY, pageWidth - 28, 26, 3, 3, 'FD');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8);
  doc.setTextColor(100, 116, 139); // slate-500
  doc.text('ASPIRANT / STUDENT NAME', 20, currentY + 7);
  doc.text('ROLL / REGISTRATION NO.', 85, currentY + 7);
  doc.text('MOBILE / CONTACT', 145, currentY + 7);

  doc.setFontSize(10.5);
  doc.setTextColor(15, 23, 42); // slate-900
  doc.text(studentInfo.name || 'Alex Johnson', 20, currentY + 14);
  doc.text(studentInfo.rollNo || 'AGM-2024-042', 85, currentY + 14);
  doc.text(studentInfo.mobile || '+91 9876543210', 145, currentY + 14);

  doc.setFontSize(7.5);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(100, 116, 139);
  doc.text('Batch: Civil Services Prelims-cum-Mains 2024-2025', 20, currentY + 21);
  doc.text('Course: Comprehensive Test Assessment Series', 85, currentY + 21);

  currentY += 34;

  // 3. Performance Summary Metric Cards (3 Cards)
  const validResults = results.length > 0 ? results : [
    { exam: 'TNPSC Group I - Prelims Mock 1', score: 142, total: 200, percentage: 71, status: 'Passed', date: '2024-09-20' },
    { exam: 'SSC CGL - Quant Sectional', score: 45, total: 50, percentage: 90, status: 'Excellent', date: '2024-09-22' },
    { exam: 'Railway RRB NTPC - Mock 4', score: 82, total: 100, percentage: 82, status: 'Passed', date: '2024-09-25' },
    { exam: 'TNPSC Group IV - Full Length', score: 265, total: 300, percentage: 88, status: 'Excellent', date: '2024-09-26' },
    { exam: 'SSC CHSL - English Tier 1', score: 38, total: 50, percentage: 76, status: 'Passed', date: '2024-09-27' }
  ];

  const totalScore = validResults.reduce((acc, r) => acc + (Number(r.marksScored ?? r.score) || 0), 0);
  const totalMax = validResults.reduce((acc, r) => acc + (Number(r.totalMarks ?? r.total) || 1), 0);
  const avgPct = totalMax > 0 ? Math.round((totalScore / totalMax) * 100) : 0;
  const highestPct = validResults.reduce((max, r) => {
    const p = r.percentage ?? Math.round(((Number(r.marksScored ?? r.score) || 0) / (Number(r.totalMarks ?? r.total) || 1)) * 100);
    return p > max ? p : max;
  }, 0);

  const cardWidth = (pageWidth - 28 - 8) / 3;
  
  // Card 1: Tests Taken
  doc.setFillColor(241, 245, 249);
  doc.setDrawColor(203, 213, 225);
  doc.roundedRect(14, currentY, cardWidth, 20, 2, 2, 'FD');
  doc.setFontSize(7.5);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(71, 85, 105);
  doc.text('TOTAL TESTS ATTEMPTED', 18, currentY + 6);
  doc.setFontSize(14);
  doc.setTextColor(15, 23, 42);
  doc.text(`${validResults.length}`, 18, currentY + 15);

  // Card 2: Cumulative Average
  doc.setFillColor(238, 242, 255); // indigo-50
  doc.setDrawColor(199, 210, 254);
  doc.roundedRect(14 + cardWidth + 4, currentY, cardWidth, 20, 2, 2, 'FD');
  doc.setFontSize(7.5);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(79, 70, 229);
  doc.text('AVERAGE SCORE', 14 + cardWidth + 8, currentY + 6);
  doc.setFontSize(14);
  doc.setTextColor(30, 27, 75);
  doc.text(`${avgPct}%`, 14 + cardWidth + 8, currentY + 15);

  // Card 3: Top Performance
  doc.setFillColor(236, 253, 245); // emerald-50
  doc.setDrawColor(167, 243, 208);
  doc.roundedRect(14 + (cardWidth + 4) * 2, currentY, cardWidth, 20, 2, 2, 'FD');
  doc.setFontSize(7.5);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(5, 150, 105);
  doc.text('HIGHEST PERFORMANCE', 14 + (cardWidth + 4) * 2 + 4, currentY + 6);
  doc.setFontSize(14);
  doc.setTextColor(6, 78, 59);
  doc.text(`${highestPct}%`, 14 + (cardWidth + 4) * 2 + 4, currentY + 15);

  currentY += 28;

  // 4. Section Title
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.setTextColor(15, 23, 42);
  doc.text('DETAILED TEST MARKS & RESULTS STATEMENT', 14, currentY);

  currentY += 4;

  // Table Header
  doc.setFillColor(15, 23, 42); // slate-900
  doc.rect(14, currentY, pageWidth - 28, 8, 'F');
  doc.setFontSize(7.5);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(255, 255, 255);
  doc.text('#', 18, currentY + 5.5);
  doc.text('EXAM / TEST NAME', 28, currentY + 5.5);
  doc.text('DATE', 105, currentY + 5.5);
  doc.text('MARKS SCORED', 130, currentY + 5.5);
  doc.text('%', 158, currentY + 5.5);
  doc.text('STATUS', 172, currentY + 5.5);

  currentY += 8;

  // Table Rows
  validResults.forEach((item, index) => {
    const isEven = index % 2 === 0;
    const rowHeight = 7.5;

    // Check if new page is needed
    if (currentY + rowHeight > pageHeight - 35) {
      doc.addPage();
      currentY = 20;

      // Repeat Table Header
      doc.setFillColor(15, 23, 42);
      doc.rect(14, currentY, pageWidth - 28, 8, 'F');
      doc.setFontSize(7.5);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(255, 255, 255);
      doc.text('#', 18, currentY + 5.5);
      doc.text('EXAM / TEST NAME', 28, currentY + 5.5);
      doc.text('DATE', 105, currentY + 5.5);
      doc.text('MARKS SCORED', 130, currentY + 5.5);
      doc.text('%', 158, currentY + 5.5);
      doc.text('STATUS', 172, currentY + 5.5);
      currentY += 8;
    }

    if (isEven) {
      doc.setFillColor(248, 250, 252);
      doc.rect(14, currentY, pageWidth - 28, rowHeight, 'F');
    }

    doc.setDrawColor(241, 245, 249);
    doc.line(14, currentY + rowHeight, pageWidth - 14, currentY + rowHeight);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7.5);
    doc.setTextColor(71, 85, 105);
    doc.text(`${index + 1}`, 18, currentY + 5);

    const testName = item.examName || item.exam || 'Test Assessment';
    doc.setTextColor(15, 23, 42);
    doc.setFont('helvetica', 'bold');
    doc.text(testName.length > 40 ? `${testName.substring(0, 38)}...` : testName, 28, currentY + 5);

    doc.setFont('helvetica', 'normal');
    doc.setTextColor(100, 116, 139);
    doc.text(item.date || 'Recent', 105, currentY + 5);

    const scored = item.marksScored ?? item.score ?? 0;
    const maxMarks = item.totalMarks ?? item.total ?? 200;
    const pct = item.percentage ?? Math.round((Number(scored) / (Number(maxMarks) || 1)) * 100);

    doc.setFont('helvetica', 'bold');
    doc.setTextColor(15, 23, 42);
    doc.text(`${scored} / ${maxMarks}`, 130, currentY + 5);

    doc.setTextColor(30, 41, 59);
    doc.text(`${pct}%`, 158, currentY + 5);

    const status = (item.status || (pct >= 50 ? 'Passed' : 'Needs Practice')).toUpperCase();
    if (status.includes('OUTSTANDING') || status.includes('EXCELLENT') || status.includes('DISTINCTION')) {
      doc.setTextColor(16, 185, 129); // emerald
    } else if (status.includes('PASS')) {
      doc.setTextColor(59, 130, 246); // blue
    } else {
      doc.setTextColor(245, 158, 11); // amber
    }
    doc.text(status, 172, currentY + 5);

    currentY += rowHeight;
  });

  currentY += 8;

  // 5. Grading Scale & Summary Notes
  if (currentY + 30 < pageHeight - 35) {
    doc.setFillColor(254, 252, 232); // amber-50
    doc.setDrawColor(254, 240, 138); // amber-200
    doc.roundedRect(14, currentY, pageWidth - 28, 18, 2, 2, 'FD');

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(7.5);
    doc.setTextColor(146, 64, 14); // amber-800
    doc.text('ACADEMY GRADING STANDARD & PASS CRITERIA:', 18, currentY + 6);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7);
    doc.setTextColor(180, 83, 9);
    doc.text('• Outstanding / Distinction: ≥ 85%  |  • Excellent: 75% - 84%  |  • Passed: 50% - 74%  |  • Needs Practice: < 50%', 18, currentY + 12);

    currentY += 24;
  }

  // 6. Signatures and Official Seals
  const footerY = pageHeight - 28;

  doc.setDrawColor(203, 213, 225);
  doc.line(14, footerY - 5, pageWidth - 14, footerY - 5);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7);
  doc.setTextColor(148, 163, 184); // slate-400
  doc.text('Generated electronically via Agamakizh IAS Academy Learning Portal.', 14, footerY);
  doc.text('Valid without physical ink signature when verified with official roll number.', 14, footerY + 4);
  doc.text('Website: www.agamakizh.in • Support: support@agamakizh.edu.in', 14, footerY + 8);

  // Controller Signature Stamp
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8);
  doc.setTextColor(15, 23, 42);
  doc.text('CONTROLLER OF EXAMINATIONS', pageWidth - 14, footerY, { align: 'right' });
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7);
  doc.setTextColor(100, 116, 139);
  doc.text('Agamakizh IAS Academy, Tamil Nadu', pageWidth - 14, footerY + 4, { align: 'right' });
  doc.text('Official Seal & Verified Transcript', pageWidth - 14, footerY + 8, { align: 'right' });

  // Save the PDF
  const filename = `${studentInfo.name.replace(/\s+/g, '_')}_Marksheet_Report_${todayStr.replace(/\s+/g, '_')}.pdf`;
  doc.save(filename);
  return true;
}

/**
 * Downloads a single exam result marksheet / scorecard
 */
export function downloadSingleResultPdf(
  result: StudentResultItem,
  studentInfo: { name: string; rollNo?: string } = { name: 'Alex Johnson', rollNo: 'AGM-2024-042' }
) {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4'
  });

  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();

  // Top Navy Header
  doc.setFillColor(15, 23, 42);
  doc.rect(0, 0, pageWidth, 42, 'F');

  // Gold Stripe
  doc.setFillColor(217, 119, 6);
  doc.rect(0, 42, pageWidth, 2.5, 'F');

  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(18);
  doc.text('AGAMAKIZH IAS ACADEMY', 14, 18);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.5);
  doc.setTextColor(203, 213, 225);
  doc.text('Center for Civil Services & Competitive Exam Excellence', 14, 25);
  doc.text('Official Examination Division • Aspirant Scorecard & Verification', 14, 31);

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8.5);
  doc.setTextColor(251, 191, 36);
  doc.text('EXAMINATION SCORECARD', pageWidth - 14, 18, { align: 'right' });
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(255, 255, 255);
  const todayStr = new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
  doc.text(`Date: ${todayStr}`, pageWidth - 14, 25, { align: 'right' });
  doc.text(`Certificate No: AGM-SC-${Date.now().toString().slice(-6)}`, pageWidth - 14, 31, { align: 'right' });

  // Student & Exam Information
  let currentY = 54;
  doc.setFillColor(248, 250, 252);
  doc.setDrawColor(226, 232, 240);
  doc.roundedRect(14, currentY, pageWidth - 28, 38, 3, 3, 'FD');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8);
  doc.setTextColor(100, 116, 139);
  doc.text('CANDIDATE NAME:', 20, currentY + 8);
  doc.text('REGISTRATION / ROLL NO:', 20, currentY + 16);
  doc.text('EXAM / ASSESSMENT:', 20, currentY + 24);
  doc.text('CATEGORY / STREAM:', 20, currentY + 32);

  const candidateName = result.studentName || studentInfo.name || 'Alex Johnson';
  const rollNo = result.rollNo || studentInfo.rollNo || 'AGM-2024-042';
  const examTitle = result.examName || result.exam || 'Competitive Mock Assessment';
  const examCategory = result.category || 'TNPSC Civil Services';

  doc.setFont('helvetica', 'bold');
  doc.setTextColor(15, 23, 42);
  doc.text(candidateName, 72, currentY + 8);
  doc.text(rollNo, 72, currentY + 16);
  doc.text(examTitle, 72, currentY + 24);
  doc.text(examCategory, 72, currentY + 32);

  currentY += 46;

  // Big Score Announcement Box
  const scored = Number(result.marksScored ?? result.score ?? 0);
  const total = Number(result.totalMarks ?? result.total ?? 200);
  const percentage = result.percentage ?? Math.round((scored / (total || 1)) * 100);
  const rank = result.rank ? `#${result.rank}` : 'Top Tier';
  const status = (result.status || (percentage >= 50 ? 'PASSED' : 'NEEDS PRACTICE')).toUpperCase();

  doc.setFillColor(240, 253, 250); // emerald-50/teal
  doc.setDrawColor(94, 234, 212);
  doc.roundedRect(14, currentY, pageWidth - 28, 45, 3, 3, 'FD');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9);
  doc.setTextColor(15, 118, 110);
  doc.text('TOTAL MARKS SCORED', 22, currentY + 10);
  doc.setFontSize(26);
  doc.setTextColor(13, 78, 77);
  doc.text(`${scored} / ${total}`, 22, currentY + 24);

  // Percentage & Status on Right
  doc.setFontSize(9);
  doc.setTextColor(15, 118, 110);
  doc.text('PERCENTAGE', 110, currentY + 10);
  doc.setFontSize(22);
  doc.setTextColor(13, 78, 77);
  doc.text(`${percentage}%`, 110, currentY + 24);

  doc.setFontSize(9);
  doc.text('ACADEMY RANK', 160, currentY + 10);
  doc.setFontSize(20);
  doc.setTextColor(180, 83, 9); // amber
  doc.text(`${rank}`, 160, currentY + 24);

  // Status Banner
  doc.setFontSize(8.5);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(13, 78, 77);
  doc.text(`Official Assessment Status: ${status}`, 22, currentY + 37);

  currentY += 55;

  // Breakdown Summary Table
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10.5);
  doc.setTextColor(15, 23, 42);
  doc.text('PERFORMANCE BREAKDOWN & EVALUATION', 14, currentY);

  currentY += 4;
  doc.setFillColor(15, 23, 42);
  doc.rect(14, currentY, pageWidth - 28, 8, 'F');
  doc.setFontSize(7.5);
  doc.setTextColor(255, 255, 255);
  doc.text('PARAMETER', 20, currentY + 5.5);
  doc.text('METRIC / VALUE', 110, currentY + 5.5);
  doc.text('PERFORMANCE REMARKS', 150, currentY + 5.5);

  currentY += 8;

  const rows = [
    { param: 'Total Questions / Total Marks', val: `${total} Marks`, remarks: 'Comprehensive Standard' },
    { param: 'Obtained Marks / Marks Scored', val: `${scored} Marks`, remarks: `${percentage}% Overall Accuracy` },
    { param: 'Percentage Score', val: `${percentage}%`, remarks: percentage >= 75 ? 'Distinction Standard' : percentage >= 50 ? 'Qualifying Standard' : 'Practice Recommended' },
    { param: 'Relative Academy Standing / Rank', val: `${rank}`, remarks: 'Among Active Aspirants' },
    { param: 'Assessment Date', val: result.date || todayStr, remarks: 'Verified by Academy Faculty' }
  ];

  rows.forEach((r, idx) => {
    if (idx % 2 === 0) {
      doc.setFillColor(248, 250, 252);
      doc.rect(14, currentY, pageWidth - 28, 7.5, 'F');
    }
    doc.setDrawColor(241, 245, 249);
    doc.line(14, currentY + 7.5, pageWidth - 14, currentY + 7.5);

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(7.5);
    doc.setTextColor(30, 41, 59);
    doc.text(r.param, 20, currentY + 5);

    doc.setFont('helvetica', 'normal');
    doc.text(r.val, 110, currentY + 5);
    doc.setTextColor(100, 116, 139);
    doc.text(r.remarks, 150, currentY + 5);

    currentY += 7.5;
  });

  currentY += 12;

  // Faculty Evaluation Note
  doc.setFillColor(238, 242, 255);
  doc.setDrawColor(199, 210, 254);
  doc.roundedRect(14, currentY, pageWidth - 28, 20, 2, 2, 'FD');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8);
  doc.setTextColor(67, 56, 202);
  doc.text('SENIOR FACULTY OBSERVATIONS & NEXT STEPS:', 18, currentY + 6);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7.5);
  doc.setTextColor(79, 70, 229);
  doc.text('Consistent revision of high-yield chapters, syllabus units, and regular full-length interactive test practice', 18, currentY + 12);
  doc.text('is essential to achieve distinction ranking in upcoming official competitive examinations.', 18, currentY + 16);

  // Footer & Seal
  const footerY = pageHeight - 26;
  doc.setDrawColor(203, 213, 225);
  doc.line(14, footerY - 5, pageWidth - 14, footerY - 5);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7);
  doc.setTextColor(148, 163, 184);
  doc.text('Official Examination Transcript issued by Agamakizh IAS Academy.', 14, footerY);
  doc.text('Verify credentials online via Agamakizh Aspirant Portal.', 14, footerY + 4);

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8);
  doc.setTextColor(15, 23, 42);
  doc.text('CONTROLLER OF EXAMINATIONS', pageWidth - 14, footerY, { align: 'right' });
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7);
  doc.setTextColor(100, 116, 139);
  doc.text('Agamakizh IAS Academy, Tamil Nadu', pageWidth - 14, footerY + 4, { align: 'right' });

  const safeExam = (examTitle).replace(/[^a-zA-Z0-9]/g, '_').substring(0, 25);
  const safeName = (candidateName).replace(/[^a-zA-Z0-9]/g, '_').substring(0, 20);
  doc.save(`${safeName}_${safeExam}_Scorecard.pdf`);
  return true;
}

/**
 * Downloads a complete Master Rankings & Marks list for the Admin Console
 */
export function downloadAdminResultsMasterPdf(results: StudentResultItem[]) {
  const doc = new jsPDF({
    orientation: 'landscape',
    unit: 'mm',
    format: 'a4'
  });

  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();

  // Header
  doc.setFillColor(15, 23, 42);
  doc.rect(0, 0, pageWidth, 35, 'F');
  doc.setFillColor(217, 119, 6);
  doc.rect(0, 35, pageWidth, 2, 'F');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(16);
  doc.setTextColor(255, 255, 255);
  doc.text('AGAMAKIZH IAS ACADEMY — ADMINISTRATIVE CONSOLE', 14, 16);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.5);
  doc.setTextColor(203, 213, 225);
  doc.text('Master Student Results & Examination Marks Register', 14, 23);

  const todayStr = new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
  doc.text(`Generated: ${todayStr}`, pageWidth - 14, 16, { align: 'right' });
  doc.text(`Total Records: ${results.length}`, pageWidth - 14, 23, { align: 'right' });

  let currentY = 44;

  // Table Header
  doc.setFillColor(15, 23, 42);
  doc.rect(14, currentY, pageWidth - 28, 8, 'F');
  doc.setFontSize(8);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(255, 255, 255);
  doc.text('#', 18, currentY + 5.5);
  doc.text('STUDENT NAME', 28, currentY + 5.5);
  doc.text('ROLL NO', 85, currentY + 5.5);
  doc.text('EXAM / TEST NAME', 125, currentY + 5.5);
  doc.text('MARKS SCORED', 195, currentY + 5.5);
  doc.text('PERCENTAGE', 230, currentY + 5.5);
  doc.text('RANK / STATUS', 255, currentY + 5.5);

  currentY += 8;

  results.forEach((r, idx) => {
    if (currentY + 7.5 > pageHeight - 20) {
      doc.addPage();
      currentY = 15;
      doc.setFillColor(15, 23, 42);
      doc.rect(14, currentY, pageWidth - 28, 8, 'F');
      doc.setFontSize(8);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(255, 255, 255);
      doc.text('#', 18, currentY + 5.5);
      doc.text('STUDENT NAME', 28, currentY + 5.5);
      doc.text('ROLL NO', 85, currentY + 5.5);
      doc.text('EXAM / TEST NAME', 125, currentY + 5.5);
      doc.text('MARKS SCORED', 195, currentY + 5.5);
      doc.text('PERCENTAGE', 230, currentY + 5.5);
      doc.text('RANK / STATUS', 255, currentY + 5.5);
      currentY += 8;
    }

    if (idx % 2 === 0) {
      doc.setFillColor(248, 250, 252);
      doc.rect(14, currentY, pageWidth - 28, 7.5, 'F');
    }

    doc.setDrawColor(241, 245, 249);
    doc.line(14, currentY + 7.5, pageWidth - 14, currentY + 7.5);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    doc.setTextColor(71, 85, 105);
    doc.text(`${idx + 1}`, 18, currentY + 5);

    doc.setFont('helvetica', 'bold');
    doc.setTextColor(15, 23, 42);
    doc.text(r.studentName || 'Alex Johnson', 28, currentY + 5);

    doc.setFont('helvetica', 'normal');
    doc.setTextColor(100, 116, 139);
    doc.text(r.rollNo || 'AGM-2024-042', 85, currentY + 5);

    const examTitle = r.examName || r.exam || 'TNPSC Mock Exam';
    doc.text(examTitle.length > 35 ? `${examTitle.substring(0, 33)}...` : examTitle, 125, currentY + 5);

    const scored = r.marksScored ?? r.score ?? 0;
    const maxMarks = r.totalMarks ?? r.total ?? 200;
    const pct = r.percentage ?? Math.round((Number(scored) / (Number(maxMarks) || 1)) * 100);

    doc.setFont('helvetica', 'bold');
    doc.setTextColor(15, 23, 42);
    doc.text(`${scored} / ${maxMarks}`, 195, currentY + 5);

    doc.text(`${pct}%`, 230, currentY + 5);

    doc.setTextColor(pct >= 50 ? 16 : 220, pct >= 50 ? 185 : 38, pct >= 50 ? 129 : 38);
    const rankText = r.rank ? `#${r.rank} ` : '';
    doc.text(`${rankText}${r.status || (pct >= 50 ? 'PASSED' : 'NEEDS PRACTICE')}`, 255, currentY + 5);

    currentY += 7.5;
  });

  doc.save(`Agamakizh_Master_Results_${todayStr.replace(/\s+/g, '_')}.pdf`);
  return true;
}

/**
 * Downloads the 2026 Academic Calendar & Comprehensive Study Plan PDF
 */
export function download2026CalendarPlanPdf(
  plans: CalendarPlanItem[],
  filterLabel: string = 'All 2026 Plans'
) {
  const doc = new jsPDF({
    orientation: 'landscape',
    unit: 'mm',
    format: 'a4'
  });

  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();

  const printHeader = (pageNum: number, totalPagesEst: number = 1) => {
    // Header background
    doc.setFillColor(15, 23, 42); // slate-900
    doc.rect(0, 0, pageWidth, 28, 'F');

    // Gold strip
    doc.setFillColor(217, 119, 6); // amber-600
    doc.rect(0, 28, pageWidth, 2, 'F');

    // Academy title
    doc.setTextColor(255, 255, 255);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(16);
    doc.text('AGAMAKIZH IAS ACADEMY', 14, 12);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8.5);
    doc.setTextColor(203, 213, 225);
    doc.text('2026 ACADEMIC CALENDAR & COMPREHENSIVE STUDY PLAN', 14, 18);
    doc.text('Subject Milestones • Multi-Phase Revision Cycles • Mock Test Series • Official Exam Notifications', 14, 23);

    // Filter and Date on Right
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(9);
    doc.setTextColor(255, 255, 255);
    doc.text(`PLAN: ${filterLabel.toUpperCase()}`, pageWidth - 14, 12, { align: 'right' });
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    doc.setTextColor(203, 213, 225);
    doc.text(`Generated: ${new Date().toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' })}`, pageWidth - 14, 18, { align: 'right' });
    doc.text(`Page ${pageNum}`, pageWidth - 14, 23, { align: 'right' });

    // Table Header
    const thY = 33;
    doc.setFillColor(241, 245, 249); // slate-100
    doc.rect(12, thY, pageWidth - 24, 8, 'F');
    doc.setDrawColor(203, 213, 225);
    doc.rect(12, thY, pageWidth - 24, 8, 'S');

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8);
    doc.setTextColor(71, 85, 105);

    doc.text('DATE', 15, thY + 5.5);
    doc.text('TYPE', 42, thY + 5.5);
    doc.text('TARGET EXAM / SUBJECT', 75, thY + 5.5);
    doc.text('MILESTONE TITLE & TOPICS', 140, thY + 5.5);
    doc.text('DURATION / STATUS', pageWidth - 16, thY + 5.5, { align: 'right' });
  };

  let currentPage = 1;
  printHeader(currentPage);
  let currentY = 44;

  const sortedPlans = [...plans].sort((a, b) => a.date.localeCompare(b.date));

  sortedPlans.forEach((item, idx) => {
    // Check if new page is needed
    if (currentY > pageHeight - 20) {
      doc.addPage();
      currentPage++;
      printHeader(currentPage);
      currentY = 44;
    }

    // Row alternating background
    if (idx % 2 === 0) {
      doc.setFillColor(248, 250, 252);
      doc.rect(12, currentY - 1, pageWidth - 24, 10.5, 'F');
    }

    doc.setDrawColor(241, 245, 249);
    doc.line(12, currentY + 9.5, pageWidth - 12, currentY + 9.5);

    // Date
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8.5);
    doc.setTextColor(15, 23, 42);
    const dateFormatted = new Date(item.date).toLocaleDateString('en-US', { day: '2-digit', month: 'short', year: 'numeric' });
    doc.text(dateFormatted, 15, currentY + 4.5);

    // Type Badge
    let typeColor = [37, 99, 235]; // blue
    let typeLabel = 'TEST PLAN';
    if (item.type === 'subject') {
      typeColor = [16, 185, 129];
      typeLabel = 'SUBJECT PLAN';
    } else if (item.type === 'revision') {
      typeColor = [217, 119, 6];
      typeLabel = 'REVISION PLAN';
    } else if (item.type === 'notification') {
      typeColor = [147, 51, 234];
      typeLabel = 'NOTIFICATION';
    }

    doc.setFillColor(typeColor[0], typeColor[1], typeColor[2]);
    doc.roundedRect(42, currentY + 1, 28, 5, 1, 1, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(6.5);
    doc.text(typeLabel, 56, currentY + 4.5, { align: 'center' });

    // Target Exam / Subject
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8);
    doc.setTextColor(30, 41, 59);
    const examCat = item.category || 'All Exams';
    doc.text(examCat, 75, currentY + 3.5);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7.5);
    doc.setTextColor(100, 116, 139);
    const subj = item.subject ? `• ${item.subject}` : '';
    doc.text(subj, 75, currentY + 7.5);

    // Milestone Title & Topics
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8);
    doc.setTextColor(15, 23, 42);
    const titleSnippet = item.title.length > 58 ? `${item.title.substring(0, 56)}...` : item.title;
    doc.text(titleSnippet, 140, currentY + 3.5);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7);
    doc.setTextColor(100, 116, 139);
    const descSnippet = item.description.length > 70 ? `${item.description.substring(0, 68)}...` : item.description;
    doc.text(descSnippet, 140, currentY + 7.5);

    // Duration / Status
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(7.5);
    doc.setTextColor(item.status === 'Completed' ? 100 : item.status === 'Ongoing' ? 16 : 37, item.status === 'Completed' ? 116 : item.status === 'Ongoing' ? 185 : 99, item.status === 'Completed' ? 139 : item.status === 'Ongoing' ? 129 : 235);
    const durText = item.duration ? `${item.duration} • ` : '';
    doc.text(`${durText}${item.status.toUpperCase()}`, pageWidth - 16, currentY + 5, { align: 'right' });

    currentY += 10.5;
  });

  // Footer on bottom of current page
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7);
  doc.setTextColor(148, 163, 184);
  doc.text('Agamakizh IAS Academy • 2026 Academic Calendar Planner • Verified & Approved by Academic Council', 14, pageHeight - 6);

  doc.save(`Agamakizh_2026_Study_Calendar_${new Date().toISOString().split('T')[0]}.pdf`);
  return true;
}

