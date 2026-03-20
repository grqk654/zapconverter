import { useState, useEffect, useRef } from 'react'
import { PDFDocument } from 'pdf-lib'
import imageCompression from 'browser-image-compression'
import { jsPDF } from 'jspdf'
import * as mammoth from 'mammoth'

// ─── URL ROUTING ──────────────────────────────────────────────────────────────
const urlToPage = (pathname) => pathname.replace(/^\//, '') || 'home'
const pageToUrl = (page) => page === 'home' ? '/' : '/' + page

// ─── DESIGN TOKENS ────────────────────────────────────────────────────────────
const G = {
  font: "'Plus Jakarta Sans', system-ui, sans-serif",
  mono: "'JetBrains Mono', monospace",
  navy: '#1a1a2e',
  blue: '#4361ee',
  bluePale: '#eef1ff',
  teal: '#1D9E75',
  tealPale: '#e1f5ee',
  amber: '#BA7517',
  amberPale: '#faeeda',
  red: '#c0392b',
  redPale: '#fcebeb',
  bg: '#f8f8f6',
  bgCard: '#ffffff',
  border: '#e8e8e4',
  borderMid: '#d0d0cc',
  text: '#1a1a2e',
  textMid: '#555',
  textMuted: '#999',
  success: '#1D9E75',
}

// ─── TOOLS CONFIG ─────────────────────────────────────────────────────────────
const TOOLS = [
  { id: 'jpg-to-pdf', name: 'JPG to PDF', desc: 'Convert JPG images to PDF', cat: 'pdf', badge: 'Popular', badgeType: 'hot', accept: '.jpg,.jpeg', multi: true },
  { id: 'png-to-pdf', name: 'PNG to PDF', desc: 'Convert PNG images to PDF', cat: 'pdf', badge: 'Popular', badgeType: 'hot', accept: '.png', multi: true },
  { id: 'merge-pdf', name: 'Merge PDF', desc: 'Combine multiple PDFs into one', cat: 'pdf', badge: null, accept: '.pdf', multi: true },
  { id: 'compress-pdf', name: 'Compress PDF', desc: 'Reduce PDF file size for email', cat: 'pdf', badge: 'Popular', badgeType: 'hot', accept: '.pdf', multi: false },
  { id: 'image-compressor', name: 'Image Compressor', desc: 'Shrink JPG, PNG, WebP files', cat: 'image', badge: null, accept: '.jpg,.jpeg,.png,.webp', multi: false },
  { id: 'jpg-png-converter', name: 'JPG ↔ PNG', desc: 'Convert between image formats', cat: 'image', badge: null, accept: '.jpg,.jpeg,.png', multi: false },
  { id: 'word-to-pdf', name: 'Word to PDF', desc: 'Convert DOCX files to PDF', cat: 'pdf', badge: 'New', badgeType: 'new', accept: '.docx', multi: false },
  { id: 'split-pdf', name: 'Split PDF', desc: 'Extract pages from a PDF', cat: 'pdf', badge: null, accept: '.pdf', multi: false },
  { id: 'webp-to-jpg', name: 'WebP to JPG', desc: 'Convert modern WebP images', cat: 'image', badge: 'New', badgeType: 'new', accept: '.webp', multi: false },
  { id: 'text-to-pdf', name: 'Text to PDF', desc: 'Turn plain text into a PDF', cat: 'pdf', badge: null, accept: null, multi: false },
]

const ARTICLES = [
  {
    id: 'how-to-convert-jpg-to-pdf',
    title: 'How to Convert JPG to PDF (Free, No Sign-up)',
    tag: 'GUIDE', tagBg: G.blue,
    excerpt: 'The fastest way to turn one or multiple JPG images into a PDF — no software, no account, no watermarks.',
    content: `Converting a JPG to PDF is one of the most common file tasks people need to do — and one of the most annoying to figure out if you don't know the right tool. This guide covers the fastest, cleanest way to do it for free.

## Why convert JPG to PDF?

PDFs are the professional standard for sharing documents. They look identical on every device, can't be accidentally edited, and are accepted by virtually every form, email system, and document portal. If you have a photo of a receipt, a scanned document, or an image you need to share formally, converting it to PDF is usually the right move.

## The fastest method: use ZapConverter

ZapConverter's JPG to PDF tool runs entirely in your browser. You select one or more JPG files, click Convert, and download the PDF — in about three seconds. No account, no upload to a server, no watermark on the output.

To convert multiple JPGs into a single PDF, just select all the files at once using the multi-file selector. They'll be arranged in the order you selected them, one image per page.

## What about quality?

ZapConverter preserves your original image quality. The images are embedded in the PDF at their original resolution — nothing is resampled or compressed during the conversion. If you want to reduce the file size afterward, run the output through the Compress PDF tool.

## Alternative methods

On a Mac, you can open a JPG in Preview and use File > Export as PDF. On Windows 10 and 11, open the image in Photos, click Print, and select "Microsoft Print to PDF" as the printer.

Both methods work but are slower than using a dedicated tool, especially for multiple images.

## Frequently Asked Questions

**Is it free to convert JPG to PDF?**
Yes — ZapConverter is completely free. No account required, no watermark on the output.

**Can I convert multiple JPGs into one PDF?**
Yes — use the multi-file selector to choose multiple images. They'll all be combined into a single PDF, one image per page.

**Will my image quality be reduced?**
No — the conversion embeds your images at full original resolution. Use the Compress PDF tool separately if you need a smaller file size.

**Is it safe to convert files in my browser?**
Yes — ZapConverter processes everything locally in your browser. Your files are never uploaded to any server.`,
  },
  {
    id: 'how-to-merge-pdf-files',
    title: 'How to Merge PDF Files for Free (2026)',
    tag: 'GUIDE', tagBg: G.blue,
    excerpt: 'Combine multiple PDF files into one document — no Adobe Acrobat, no account, completely free.',
    content: `Merging PDF files is something most people need to do occasionally — combining invoices, assembling a report, packaging documents for a job application — and it shouldn't require paying for Adobe Acrobat.

## The free way: browser-based merging

ZapConverter's Merge PDF tool lets you combine as many PDF files as you want, in any order, with no account required. The merging happens in your browser, which means your documents never leave your device — important for anything confidential.

## Step by step

1. Open the Merge PDF tool
2. Click "Choose files" and select all the PDFs you want to merge
3. The files are listed in the order you selected them — this becomes the page order in the final PDF
4. Click Convert
5. Download your merged PDF

The output is a standard PDF that can be opened in any PDF viewer.

## What about page order?

Files are merged in the order you select them. If you need a specific order, select them in that order. On most operating systems you can hold Ctrl (Windows) or Cmd (Mac) while clicking to select multiple files in a specific sequence.

## File size considerations

The merged PDF will be roughly the sum of all the input PDF file sizes. If the result is too large — say, for an email attachment — run it through the Compress PDF tool to reduce the size.

## Frequently Asked Questions

**Is there a limit to how many PDFs I can merge?**
No hard limit — but very large files may be slow to process in older browsers.

**Will merging PDFs reduce the quality?**
No — the pages are copied as-is into the merged document with no quality loss.

**Can I merge PDFs with different page sizes?**
Yes — ZapConverter handles mixed page sizes in a single merged document.

**Is merging PDFs free without Adobe Acrobat?**
Yes — ZapConverter is completely free with no subscription required.`,
  },
  {
    id: 'how-to-compress-pdf',
    title: 'How to Compress a PDF File (Without Losing Quality)',
    tag: 'GUIDE', tagBg: G.teal,
    excerpt: 'Reduce PDF file size for email and upload limits — without ruining the quality of your document.',
    content: `PDF files can get large fast, especially if they contain high-resolution images. Most email systems cap attachments at 10–25MB, and many document portals have even tighter limits. Compressing a PDF gets it under the threshold without starting over.

## How PDF compression works

PDF files can be made smaller in a few ways: downsampling embedded images (reducing their resolution), removing embedded fonts that aren't needed, and stripping metadata. The most significant savings usually come from the images — a PDF with a 12MP photo embedded at full resolution can often be reduced by 60–80% with minimal visible quality loss.

## Using ZapConverter to compress

ZapConverter's Compress PDF tool processes your PDF in the browser. Select your file, click Convert, and download the compressed version. The tool focuses on image optimization while preserving the text and structure of your document.

## How much smaller will it get?

It depends heavily on what's in the PDF. A PDF that's mostly text with a few images might shrink 20–30%. A PDF of scanned photos might shrink 60–80%. A PDF that's already been compressed won't shrink much further.

## When to use compression vs. other approaches

If your PDF is large because it has many pages, compression alone might not bring it below your target size. In that case, use Split PDF to break it into smaller chunks, or consider whether all pages are needed.

## Frequently Asked Questions

**Will compressing a PDF make it look worse?**
For documents that are mostly text, there's no visible quality change. For image-heavy PDFs, there may be a small reduction in image sharpness at very high zoom levels, but it's rarely noticeable at normal reading size.

**How much can I compress a PDF?**
Depends on the content. Image-heavy PDFs often reduce 50–80%. Text-only PDFs might only reduce 10–20%.

**Can I compress a PDF without losing text?**
Yes — compression targets embedded images, not text or vector graphics.

**Is it free to compress a PDF online?**
Yes — ZapConverter is completely free with no file size limits and no account required.`,
  },
  {
    id: 'how-to-convert-word-to-pdf',
    title: 'How to Convert Word to PDF Free (Without Microsoft Office)',
    tag: 'GUIDE', tagBg: G.blue,
    excerpt: 'Convert a DOCX file to PDF without needing Microsoft Word installed — free and instant.',
    content: `Converting a Word document to PDF is one of the most searched file tasks online — and most people don't realize you don't need Microsoft Word or any installed software to do it.

## Why convert Word to PDF?

PDFs look identical on every device and operating system. A Word document can shift formatting depending on which version of Word opens it, what fonts are installed, and what operating system the reader is using. Converting to PDF locks the formatting permanently — what you see is what they get.

## Using ZapConverter (no Word required)

ZapConverter's Word to PDF tool extracts the text content from your DOCX file and generates a clean PDF. The tool uses mammoth.js, a document parsing library that runs in your browser — no upload to a server, no Microsoft Office dependency.

Note: For complex documents with custom fonts, tables, or embedded images, the output PDF will render the text content cleanly but may not perfectly replicate advanced formatting. For pixel-perfect layout preservation, Microsoft Word's native export (File > Save As > PDF) remains the gold standard.

## The Microsoft Word method (if you have it)

In Word: File > Save As > choose PDF from the format dropdown. This produces a PDF that exactly matches what you see in Word, including all custom fonts and precise layout.

On Mac: File > Export > Export as PDF.

## Google Docs method (free)

Upload your DOCX to Google Drive. Open it in Google Docs. File > Download > PDF Document. This is free and handles most formatting well.

## Frequently Asked Questions

**Can I convert Word to PDF without Microsoft Word?**
Yes — ZapConverter's Word to PDF tool works without Word installed.

**Will the formatting be preserved?**
Text content and basic formatting are preserved. Complex layouts with custom fonts or advanced table styles render best using Word's native export.

**Is it free to convert Word to PDF?**
Yes — ZapConverter is completely free.

**Is it safe to convert confidential Word documents?**
Yes — ZapConverter processes files entirely in your browser. Nothing is uploaded to a server.`,
  },
  {
    id: 'best-free-pdf-converter',
    title: 'Best Free PDF Converter Online in 2026 (No Sign-up)',
    tag: 'COMPARE', tagBg: G.navy,
    excerpt: 'We compared the top free PDF converters. Here\'s the honest breakdown of which tools are actually free.',
    content: `"Free" PDF converters are everywhere — but most of them aren't actually free. They give you one or two conversions before hitting you with a paywall, add watermarks to your output, or require creating an account. Here's the honest comparison.

## What "actually free" means

A truly free PDF converter gives you unlimited conversions with no account, no watermark, and no hidden paywall. By that definition, the field narrows considerably.

## The top options in 2026

**ZapConverter** — 10 tools, 100% free, no account, no watermark, browser-based. Your files never leave your device. The trade-off: doesn't do PDF-to-Word editing (that requires server-side processing).

**Smallpdf** — Polished interface and wide tool selection. Free tier allows 2 tasks per hour. Account required for more. Output occasionally watermarked on free tier. Good for occasional use if the rate limit isn't a problem.

**ILovePDF** — Similar to Smallpdf. More generous free tier but pushes premium heavily. Uploads files to their servers.

**Adobe Acrobat online** — Free for basic PDF creation. Most editing and conversion tools require an Acrobat subscription ($14.99–$23.99/mo). Best-in-class quality but expensive.

**PDF24** — Genuinely generous free tier. Desktop app available. Based in Germany with strong privacy policy. Good alternative.

## The privacy question

Most online PDF converters upload your files to their servers to process them. This is fine for non-sensitive documents but a real concern for anything confidential — contracts, medical records, financial documents.

ZapConverter and PDF24 both process files locally in your browser, meaning your files never leave your device. This is the safest option for sensitive documents.

## Frequently Asked Questions

**What is the best free PDF converter online?**
For a 100% free, no-account tool with privacy protection, ZapConverter is the top choice. For more advanced features including PDF editing, Smallpdf or Adobe Acrobat online offer more tools with a freemium model.

**Are free PDF converters safe?**
Browser-based converters like ZapConverter are safe because files never leave your device. Server-based converters upload your files — check their privacy policy before using for sensitive documents.

**Do free PDF converters add watermarks?**
ZapConverter never adds watermarks. Smallpdf and ILovePDF may add watermarks on some operations on the free tier.`,
  },
  {
    id: 'how-to-compress-images',
    title: 'How to Compress Images Without Losing Quality (2026)',
    tag: 'GUIDE', tagBg: G.amber,
    excerpt: 'Reduce image file size for web, email, and social — without making your photos look worse.',
    content: `Large image files slow down websites, bounce off email size limits, and eat storage. Compressing images is one of the most useful things you can do for any kind of digital work — and it doesn't have to reduce visible quality.

## How image compression works

There are two types of image compression: lossless and lossy.

Lossless compression reduces file size without any quality loss by encoding image data more efficiently. PNG files use lossless compression by default. The savings are modest — usually 10–30%.

Lossy compression achieves much larger reductions by discarding some image data that's hard for the human eye to detect. JPEG files use lossy compression. A well-tuned JPEG at 80% quality is usually indistinguishable from the original at 100% quality, but the file might be 60% smaller.

## Using ZapConverter's Image Compressor

ZapConverter's Image Compressor works on JPG, PNG, and WebP files. Select your image, click Convert, and download the compressed version. The tool uses browser-image-compression, which applies smart lossy compression while targeting a maximum output size. Everything runs in your browser — no upload.

## Target file sizes for common uses

- Email attachment: under 1MB per image
- Website images: 100–300KB for most images, under 100KB for thumbnails
- Social media: platforms recompress anyway — 500KB–1MB is usually fine

## Frequently Asked Questions

**How much can I compress an image without losing quality?**
For JPEGs, reducing to 75–80% quality usually produces no visible difference while cutting file size by 50–70%. PNG compression is more limited — 10–30% is typical without quality loss.

**What is the best image format for small file sizes?**
WebP is the most efficient modern format — smaller than both JPG and PNG at equivalent quality. For compatibility with older software, JPG is the best option for photos and PNG for graphics with transparency.

**Can I compress images without installing software?**
Yes — ZapConverter's Image Compressor runs entirely in your browser with no software installation or account required.

**Does compressing an image reduce its dimensions?**
No — ZapConverter compresses image data without changing the pixel dimensions of your image.`,
  },
  {
    id: 'jpg-vs-png-which-format',
    title: 'JPG vs PNG: Which Image Format Should You Use?',
    tag: 'EXPLAINED', tagBg: G.teal,
    excerpt: 'The practical guide to choosing between JPG and PNG — and when WebP beats both.',
    content: `JPG and PNG are the two most common image formats, but they're not interchangeable. Choosing the wrong one leads to either unnecessarily large files or visible quality loss. Here's the practical guide.

## JPG: best for photos

JPG (also written JPEG) uses lossy compression, which makes it very efficient for photographs and images with gradients and complex colors. A typical photo saved as JPG at 80% quality will be 5–10x smaller than the same image as PNG.

The trade-off: JPG degrades slightly each time you save it. For a final export, that's fine. For a working file you plan to edit repeatedly, use PNG or a lossless format.

**Use JPG for:** Photos, complex images, anything you're sharing or uploading as a final file.

## PNG: best for graphics and transparency

PNG uses lossless compression, so there's no quality loss no matter how many times you save it. PNG also supports transparency (alpha channel), which JPG does not.

The trade-off: PNG files are much larger than JPG for photos. A 1MB JPG photo might be 5–8MB as PNG.

**Use PNG for:** Logos, icons, screenshots, graphics with text, anything with a transparent background.

## WebP: the modern choice

WebP is a newer format developed by Google that achieves smaller files than both JPG and PNG at equivalent quality. A WebP file is typically 25–35% smaller than a comparable JPG. All modern browsers support WebP.

The trade-off: some older software doesn't open WebP files. If compatibility matters (sending to someone who might open it in old software), stick with JPG or PNG.

**Use WebP for:** Web images where file size matters and you control the environment.

## Converting between formats

ZapConverter's JPG ↔ PNG converter and WebP to JPG converter let you switch between formats instantly in your browser.

## Frequently Asked Questions

**Should I use JPG or PNG for social media?**
JPG for photos, PNG for graphics and screenshots. Most platforms recompress images anyway, so the difference is minimal.

**Does converting JPG to PNG improve quality?**
No — converting a JPG to PNG doesn't recover the quality lost when the JPG was originally created. It just stores the existing quality losslessly.

**Is WebP better than JPG?**
For file size, yes — WebP is typically 25–35% smaller at equivalent quality. Use it where supported.`,
  },
  {
    id: 'what-is-webp-format',
    title: 'What Is WebP Format? (And How to Convert It)',
    tag: 'EXPLAINED', tagBg: G.teal,
    excerpt: 'WebP is Google\'s modern image format — smaller files, great quality. Here\'s everything you need to know.',
    content: `WebP has become increasingly common as the default image format for websites and apps. If you've ever downloaded an image and found it opened with an unfamiliar extension, or noticed that screenshots sometimes save as .webp, this guide explains what it is and what to do with it.

## What is WebP?

WebP is an image format developed by Google and released in 2010. It uses a combination of lossy and lossless compression techniques that achieve significantly smaller file sizes than JPG and PNG at comparable quality. Google reported that WebP images are 25–34% smaller than equivalent JPEGs.

WebP also supports transparency (like PNG) and animation (like GIF), making it a versatile format that can replace all three of those legacy formats.

## Why do websites use WebP?

Smaller image files load faster, which improves website performance and Google search rankings (page speed is a ranking factor). As a result, most modern websites, social platforms, and apps now serve images in WebP format.

When you screenshot a website or download an image from a modern platform, you'll often get a .webp file.

## The compatibility problem

Despite being widely supported in browsers, WebP files don't open in all software. Older versions of Photoshop, Windows Photo Viewer (not Photos), and some email clients don't handle WebP. If you receive a WebP file and can't open it, or need to share an image that will definitely open for the recipient, converting to JPG is the practical solution.

## Converting WebP to JPG

ZapConverter's WebP to JPG tool converts .webp files to .jpg instantly in your browser. No upload, no account, free.

## Frequently Asked Questions

**Can I open a WebP file on Windows?**
Yes — Windows Photos app and most modern browsers open WebP. For editing in older software, convert to JPG first.

**Does converting WebP to JPG reduce quality?**
Slightly — converting from WebP to JPG applies lossy compression. For most purposes the difference is invisible, but the converted file won't be identical to the original.

**Is WebP better than PNG?**
For photos, yes — WebP is smaller at equivalent quality. For graphics that require perfect lossless quality, PNG is still a strong choice.

**Why is my downloaded image a WebP file?**
Modern websites and apps serve WebP by default because it loads faster. Your browser or the website's server chose the most efficient format.`,
  },
  {
    id: 'how-to-split-pdf',
    title: 'How to Split a PDF Into Multiple Files (Free)',
    tag: 'GUIDE', tagBg: G.blue,
    excerpt: 'Extract specific pages from a PDF or split it into separate documents — no Adobe required.',
    content: `Sometimes you have a large PDF and only need a few pages from it — a specific contract clause, selected slides from a deck, or one chapter from a report. Splitting a PDF lets you extract exactly what you need without editing software.

## When to split a PDF

Common reasons to split a PDF: extracting one document from a multi-document scan, reducing file size by removing unnecessary pages, separating a combined report into individual sections, or getting specific pages to share with someone.

## Using ZapConverter to split

ZapConverter's Split PDF tool lets you specify exactly which pages to extract. Enter a page range (like "1-3") or individual page numbers (like "1,3,5") and download only those pages as a new PDF.

## Page range syntax

- "1-5" — extract pages 1 through 5
- "1,3,7" — extract specific individual pages
- "2-4,8,10-12" — combine ranges and individual pages

## Alternative: split into individual pages

If you want to split every page into its own file, specify each page individually. For a 10-page document: extract pages 1-1, 2-2, 3-3, and so on.

## File size after splitting

The output PDF will be proportionally smaller than the original — roughly (pages extracted / total pages) × original file size, adjusted for which pages have heavy image content.

## Frequently Asked Questions

**Can I extract just one page from a PDF?**
Yes — enter that page number in the page range field (e.g., "3" for just page 3).

**Does splitting a PDF reduce quality?**
No — pages are copied as-is with no quality reduction.

**Can I split a PDF without Adobe Acrobat?**
Yes — ZapConverter splits PDFs entirely in your browser for free with no account required.

**What if I want every page as a separate file?**
Run the split tool once per page. It's tedious for large documents — a future update will add batch splitting.`,
  },
  {
    id: 'pdf-file-size-too-large',
    title: 'PDF File Too Large? Here\'s How to Fix It (2026)',
    tag: 'FIX', tagBg: G.red,
    excerpt: 'Your PDF is too big for email or an upload portal. Here are the fastest ways to reduce it.',
    content: `You've finished a document, tried to attach it to an email, and hit the size limit. Or you're trying to upload to a portal that only accepts files under 5MB. Here's how to fix it quickly.

## Why are PDFs so large?

The most common culprit is embedded images. A PDF containing a few 12-megapixel photos can easily be 15–20MB. Other factors: embedded fonts (especially subsetted custom fonts), uncompressed vector graphics, and metadata.

## Method 1: Compress the PDF (fastest)

Use ZapConverter's Compress PDF tool. Upload your PDF, click Convert, download the compressed version. This works best when the PDF contains images — typical reduction is 40–80% for image-heavy documents.

## Method 2: Reduce image quality in the source document

If you created the PDF from a Word document or design tool, reduce the image resolution before exporting. In Word: File > Options > Advanced > Image Size and Quality — set to 150ppi or 96ppi instead of the default 220ppi. Re-export to PDF. This often produces better results than compressing after the fact.

## Method 3: Split the PDF

If the document is legitimately long and large, split it into sections. Many upload portals accept multiple smaller files.

## Method 4: Use a different PDF export setting

If you control the original export, choose "Smallest file size" in the PDF export options (available in Word, Adobe, and most design tools). This applies compression during creation rather than after.

## Target file sizes

- Email attachment (Gmail/Outlook): under 25MB, ideally under 10MB
- Most document portals: under 5MB or 10MB
- Web upload forms: often under 2MB

## Frequently Asked Questions

**Why is my PDF so large even though it doesn't have many pages?**
Almost certainly embedded high-resolution images. Even one or two photos can make a PDF very large.

**What is the maximum PDF size for email?**
Gmail and Outlook support up to 25MB attachments. Many corporate email servers reject anything over 10MB.

**Can I reduce PDF size without losing text quality?**
Yes — PDF compression primarily targets images. Text and vector graphics are unaffected.

**How small can I make a PDF?**
Depends on the content. Image-heavy PDFs often reduce 60–80%. Text-only PDFs might only reduce 10–20%.`,
  },
]

// ─── COMPONENTS ──────────────────────────────────────────────────────────────
function AdBanner({ size = 'leaderboard' }) {
  const h = size === 'leaderboard' ? '60px' : '90px'
  return (
    <div style={{ background: '#f0ede8', border: '1px dashed #ccc', height: h, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '11px', color: '#bbb', letterSpacing: '1.5px', fontFamily: G.font, borderRadius: '6px', margin: '4px 0' }}>
      ADVERTISEMENT — ADSENSE PLACEHOLDER
    </div>
  )
}

function AffiliateCTA({ tool }) {
  const ctas = {
    'pdf': [
      { name: 'Adobe Acrobat Pro', desc: 'Edit, sign & annotate PDFs', url: 'https://www.adobe.com/acrobat', color: '#e8473a' },
      { name: 'Dropbox', desc: 'Save & share your converted files', url: 'https://www.dropbox.com', color: '#0061ff' },
    ],
    'word': [
      { name: 'Microsoft 365', desc: 'Full Word + Office suite', url: 'https://www.microsoft.com/microsoft-365', color: '#D83B01' },
      { name: 'Adobe Acrobat Pro', desc: 'Advanced PDF editing & signing', url: 'https://www.adobe.com/acrobat', color: '#e8473a' },
    ],
    'image': [
      { name: 'Dropbox', desc: 'Store & share your images', url: 'https://www.dropbox.com', color: '#0061ff' },
      { name: 'Adobe Acrobat Pro', desc: 'Full PDF & document suite', url: 'https://www.adobe.com/acrobat', color: '#e8473a' },
    ],
  }
  const type = tool === 'word-to-pdf' ? 'word' : tool.includes('image') || tool.includes('jpg') || tool.includes('png') || tool.includes('webp') ? 'image' : 'pdf'
  const items = ctas[type]
  return (
    <div style={{ background: G.bluePale, border: `1px solid #c5d0f8`, borderRadius: '10px', padding: '16px 20px', marginTop: '24px' }}>
      <div style={{ fontSize: '12px', fontWeight: 700, color: '#3451c7', letterSpacing: '0.5px', marginBottom: '10px', fontFamily: G.font }}>NEED MORE POWER?</div>
      <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
        {items.map(item => (
          <a key={item.name} href={item.url} target="_blank" rel="noopener noreferrer sponsored"
            style={{ flex: 1, minWidth: '160px', background: '#fff', border: `1px solid ${G.border}`, borderRadius: '8px', padding: '12px 14px', textDecoration: 'none', display: 'block' }}>
            <div style={{ fontSize: '13px', fontWeight: 700, color: item.color, marginBottom: '3px', fontFamily: G.font }}>{item.name}</div>
            <div style={{ fontSize: '11px', color: G.textMuted, fontFamily: G.font }}>{item.desc} →</div>
          </a>
        ))}
      </div>
    </div>
  )
}

function TrustBar() {
  const items = ['Files never leave your device', 'No account required', 'No watermarks', 'Always free']
  return (
    <div style={{ background: '#fff', borderTop: `1px solid ${G.border}`, borderBottom: `1px solid ${G.border}`, padding: '12px 24px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '28px', flexWrap: 'wrap' }}>
      {items.map((item, i) => (
        <div key={item} style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', color: G.textMid, fontWeight: 500, fontFamily: G.font }}>
          <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: i % 2 === 0 ? G.blue : G.teal }} />
          {item}
        </div>
      ))}
    </div>
  )
}

function Nav({ page, setPage }) {
  return (
    <nav style={{ background: '#fff', borderBottom: `1px solid ${G.border}`, padding: '0 24px', height: '54px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', position: 'sticky', top: 0, zIndex: 100 }}>
      <div onClick={() => setPage('home')} style={{ display: 'flex', alignItems: 'center', gap: '9px', cursor: 'pointer' }}>
        <div style={{ width: '30px', height: '30px', background: G.navy, borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '15px' }}>⚡</div>
        <span style={{ fontSize: '17px', fontWeight: 700, color: G.navy, letterSpacing: '-0.3px', fontFamily: G.font }}>Zap<span style={{ color: G.blue }}>Converter</span></span>
      </div>
      <div style={{ display: 'flex', gap: '24px', alignItems: 'center' }}>
        {[['Tools', 'tools'], ['Guides', 'guides']].map(([label, target]) => (
          <span key={target} onClick={() => setPage(target)} style={{ fontSize: '13px', fontWeight: 500, color: page.startsWith(target) ? G.blue : G.textMid, cursor: 'pointer', fontFamily: G.font }}>{label}</span>
        ))}
      </div>
    </nav>
  )
}

function Footer({ setPage }) {
  return (
    <footer style={{ background: G.navy, padding: '32px 24px', marginTop: '60px' }}>
      <div style={{ maxWidth: '900px', margin: '0 auto', display: 'flex', flexWrap: 'wrap', gap: '32px', justifyContent: 'space-between' }}>
        <div>
          <div onClick={() => setPage('home')} style={{ fontSize: '16px', fontWeight: 700, color: '#fff', marginBottom: '8px', fontFamily: G.font, cursor: 'pointer' }}>
            Zap<span style={{ color: G.blue }}>Converter</span>
          </div>
          <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.4)', lineHeight: 1.6, maxWidth: '200px', fontFamily: G.font }}>Free file conversion. Browser-based. No account needed.</div>
        </div>
        <div>
          <div style={{ fontSize: '11px', fontWeight: 700, color: 'rgba(255,255,255,0.5)', letterSpacing: '0.5px', marginBottom: '10px', fontFamily: G.font }}>TOOLS</div>
          {TOOLS.slice(0, 5).map(t => (
            <div key={t.id} onClick={() => setPage('tools/' + t.id)} style={{ fontSize: '12px', color: 'rgba(255,255,255,0.4)', marginBottom: '6px', cursor: 'pointer', fontFamily: G.font }}>{t.name}</div>
          ))}
        </div>
        <div>
          <div style={{ fontSize: '11px', fontWeight: 700, color: 'rgba(255,255,255,0.5)', letterSpacing: '0.5px', marginBottom: '10px', fontFamily: G.font }}>GUIDES</div>
          {ARTICLES.slice(0, 4).map(a => (
            <div key={a.id} onClick={() => setPage('guides/' + a.id)} style={{ fontSize: '12px', color: 'rgba(255,255,255,0.4)', marginBottom: '6px', cursor: 'pointer', fontFamily: G.font, maxWidth: '180px', lineHeight: 1.4 }}>{a.title}</div>
          ))}
        </div>
      </div>
      <div style={{ maxWidth: '900px', margin: '24px auto 0', borderTop: '1px solid rgba(255,255,255,0.08)', paddingTop: '16px', fontSize: '11px', color: 'rgba(255,255,255,0.25)', fontFamily: G.font }}>
        © 2026 zapconverter.com · Browser-based file conversion · Affiliate links may earn a commission
      </div>
    </footer>
  )
}

// ─── CONVERTER ENGINE ─────────────────────────────────────────────────────────
async function runConversion(toolId, files, options = {}) {
  switch (toolId) {
    case 'jpg-to-pdf':
    case 'png-to-pdf': {
      const pdfDoc = await PDFDocument.create()
      for (const file of files) {
        const bytes = await file.arrayBuffer()
        const isJpg = file.type === 'image/jpeg'
        const img = isJpg ? await pdfDoc.embedJpg(bytes) : await pdfDoc.embedPng(bytes)
        const page = pdfDoc.addPage([img.width, img.height])
        page.drawImage(img, { x: 0, y: 0, width: img.width, height: img.height })
      }
      const pdfBytes = await pdfDoc.save()
      return { bytes: pdfBytes, mime: 'application/pdf', ext: 'pdf', name: files[0].name.replace(/\.[^.]+$/, '') + (files.length > 1 ? '_combined' : '') + '.pdf' }
    }
    case 'merge-pdf': {
      const merged = await PDFDocument.create()
      for (const file of files) {
        const bytes = await file.arrayBuffer()
        const doc = await PDFDocument.load(bytes)
        const pages = await merged.copyPages(doc, doc.getPageIndices())
        pages.forEach(p => merged.addPage(p))
      }
      const pdfBytes = await merged.save()
      return { bytes: pdfBytes, mime: 'application/pdf', ext: 'pdf', name: 'merged.pdf' }
    }
    case 'compress-pdf': {
      const bytes = await files[0].arrayBuffer()
      const doc = await PDFDocument.load(bytes)
      const pdfBytes = await doc.save({ useObjectStreams: true })
      return { bytes: pdfBytes, mime: 'application/pdf', ext: 'pdf', name: files[0].name.replace('.pdf', '_compressed.pdf') }
    }
    case 'image-compressor': {
      const compressed = await imageCompression(files[0], { maxSizeMB: 0.5, maxWidthOrHeight: 2048, useWebWorker: true })
      const bytes = await compressed.arrayBuffer()
      const ext = files[0].name.split('.').pop()
      return { bytes: new Uint8Array(bytes), mime: compressed.type, ext, name: files[0].name.replace(/(\.[^.]+)$/, '_compressed$1') }
    }
    case 'jpg-png-converter': {
      return new Promise((resolve) => {
        const img = new Image()
        const url = URL.createObjectURL(files[0])
        img.onload = () => {
          const canvas = document.createElement('canvas')
          canvas.width = img.width; canvas.height = img.height
          canvas.getContext('2d').drawImage(img, 0, 0)
          const isJpg = files[0].type === 'image/jpeg'
          const outMime = isJpg ? 'image/png' : 'image/jpeg'
          const outExt = isJpg ? 'png' : 'jpg'
          canvas.toBlob(blob => {
            blob.arrayBuffer().then(buf => {
              URL.revokeObjectURL(url)
              resolve({ bytes: new Uint8Array(buf), mime: outMime, ext: outExt, name: files[0].name.replace(/\.[^.]+$/, '') + '.' + outExt })
            })
          }, outMime, 0.92)
        }
        img.src = url
      })
    }
    case 'webp-to-jpg': {
      return new Promise((resolve) => {
        const img = new Image()
        const url = URL.createObjectURL(files[0])
        img.onload = () => {
          const canvas = document.createElement('canvas')
          canvas.width = img.width; canvas.height = img.height
          canvas.getContext('2d').drawImage(img, 0, 0)
          canvas.toBlob(blob => {
            blob.arrayBuffer().then(buf => {
              URL.revokeObjectURL(url)
              resolve({ bytes: new Uint8Array(buf), mime: 'image/jpeg', ext: 'jpg', name: files[0].name.replace(/\.webp$/i, '.jpg') })
            })
          }, 'image/jpeg', 0.92)
        }
        img.src = url
      })
    }
    case 'word-to-pdf': {
      const bytes = await files[0].arrayBuffer()
      const result = await mammoth.extractRawText({ arrayBuffer: bytes })
      const text = result.value
      const doc = new jsPDF({ unit: 'mm', format: 'a4' })
      doc.setFont('helvetica')
      doc.setFontSize(11)
      const lines = doc.splitTextToSize(text, 175)
      let y = 20
      for (const line of lines) {
        if (y > 275) { doc.addPage(); y = 20 }
        doc.text(line, 17, y)
        y += 6
      }
      const pdfBytes = doc.output('arraybuffer')
      return { bytes: new Uint8Array(pdfBytes), mime: 'application/pdf', ext: 'pdf', name: files[0].name.replace(/\.docx$/i, '.pdf') }
    }
    case 'split-pdf': {
      const bytes = await files[0].arrayBuffer()
      const src = await PDFDocument.load(bytes)
      const total = src.getPageCount()
      const raw = options.pageRange || '1'
      const indices = []
      raw.split(',').forEach(part => {
        const range = part.trim().split('-').map(n => parseInt(n.trim()))
        if (range.length === 2) {
          for (let i = range[0]; i <= Math.min(range[1], total); i++) indices.push(i - 1)
        } else if (!isNaN(range[0])) {
          const idx = range[0] - 1
          if (idx >= 0 && idx < total) indices.push(idx)
        }
      })
      if (indices.length === 0) throw new Error('No valid pages specified')
      const newDoc = await PDFDocument.create()
      const pages = await newDoc.copyPages(src, indices)
      pages.forEach(p => newDoc.addPage(p))
      const pdfBytes = await newDoc.save()
      return { bytes: pdfBytes, mime: 'application/pdf', ext: 'pdf', name: files[0].name.replace('.pdf', '_split.pdf') }
    }
    case 'text-to-pdf': {
      const text = options.text || ''
      if (!text.trim()) throw new Error('Please enter some text first')
      const doc = new jsPDF({ unit: 'mm', format: 'a4' })
      doc.setFont('helvetica')
      doc.setFontSize(12)
      const lines = doc.splitTextToSize(text, 175)
      let y = 20
      for (const line of lines) {
        if (y > 275) { doc.addPage(); y = 20 }
        doc.text(line, 17, y)
        y += 7
      }
      const pdfBytes = doc.output('arraybuffer')
      return { bytes: new Uint8Array(pdfBytes), mime: 'application/pdf', ext: 'pdf', name: 'converted.pdf' }
    }
    default:
      throw new Error('Unknown tool')
  }
}

function downloadResult(result) {
  const blob = new Blob([result.bytes], { type: result.mime })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url; a.download = result.name
  a.click()
  setTimeout(() => URL.revokeObjectURL(url), 1000)
}

function formatBytes(bytes) {
  if (bytes < 1024) return bytes + ' B'
  if (bytes < 1048576) return (bytes / 1024).toFixed(1) + ' KB'
  return (bytes / 1048576).toFixed(1) + ' MB'
}

// ─── TOOL PAGE ────────────────────────────────────────────────────────────────
function ToolPage({ toolId, setPage }) {
  const tool = TOOLS.find(t => t.id === toolId)
  const [files, setFiles] = useState([])
  const [status, setStatus] = useState('idle') // idle | converting | done | error
  const [errorMsg, setErrorMsg] = useState('')
  const [result, setResult] = useState(null)
  const [pageRange, setPageRange] = useState('1')
  const [textContent, setTextContent] = useState('')
  const [dragOver, setDragOver] = useState(false)
  const inputRef = useRef()

  if (!tool) return <div style={{ padding: '60px', textAlign: 'center', fontFamily: G.font }}>Tool not found. <span onClick={() => setPage('tools')} style={{ color: G.blue, cursor: 'pointer' }}>Back to all tools →</span></div>

  const isTextTool = tool.id === 'text-to-pdf'

  const handleFiles = (incoming) => {
    const arr = Array.from(incoming)
    setFiles(tool.multi ? arr : [arr[0]])
    setStatus('idle')
    setResult(null)
    setErrorMsg('')
  }

  const handleDrop = (e) => {
    e.preventDefault(); setDragOver(false)
    if (e.dataTransfer.files.length) handleFiles(e.dataTransfer.files)
  }

  const convert = async () => {
    if (!isTextTool && files.length === 0) return
    setStatus('converting')
    try {
      const res = await runConversion(tool.id, files, { pageRange, text: textContent })
      setResult(res)
      setStatus('done')
    } catch (e) {
      setErrorMsg(e.message || 'Conversion failed. Please try again.')
      setStatus('error')
    }
  }

  const reset = () => { setFiles([]); setStatus('idle'); setResult(null); setErrorMsg('') }

  const catIcon = { 'jpg-to-pdf': '🖼', 'png-to-pdf': '🖼', 'merge-pdf': '📑', 'compress-pdf': '🗜', 'image-compressor': '🗜', 'jpg-png-converter': '🔄', 'word-to-pdf': '📝', 'split-pdf': '✂️', 'webp-to-jpg': '🌐', 'text-to-pdf': '📋' }
  const catColor = { pdf: G.bluePale, image: G.amberPale }

  return (
    <div style={{ maxWidth: '720px', margin: '0 auto', padding: '32px 24px' }}>
      <div style={{ fontSize: '12px', color: G.textMuted, marginBottom: '8px', fontFamily: G.font }}>
        <span onClick={() => setPage('home')} style={{ cursor: 'pointer', color: G.blue }}>Home</span>
        {' › '}
        <span onClick={() => setPage('tools')} style={{ cursor: 'pointer', color: G.blue }}>Tools</span>
        {' › '}{tool.name}
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '6px' }}>
        <div style={{ width: '44px', height: '44px', borderRadius: '10px', background: catColor[tool.cat] || G.bluePale, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '20px' }}>{catIcon[tool.id]}</div>
        <div>
          <h1 style={{ fontFamily: G.font, fontSize: '26px', fontWeight: 700, color: G.text, margin: 0, letterSpacing: '-0.3px' }}>{tool.name}</h1>
          <p style={{ fontFamily: G.font, fontSize: '13px', color: G.textMuted, margin: 0 }}>{tool.desc} — free, no sign-up</p>
        </div>
      </div>

      <AdBanner size="leaderboard" />

      <div style={{ background: '#fff', border: `1px solid ${G.border}`, borderRadius: '12px', padding: '24px', marginTop: '16px' }}>

        {isTextTool ? (
          <div>
            <div style={{ fontSize: '13px', fontWeight: 600, color: G.text, marginBottom: '8px', fontFamily: G.font }}>Paste or type your text</div>
            <textarea
              value={textContent}
              onChange={e => setTextContent(e.target.value)}
              placeholder="Enter your text here..."
              style={{ width: '100%', height: '200px', padding: '12px', border: `1px solid ${G.border}`, borderRadius: '8px', fontSize: '13px', fontFamily: G.font, resize: 'vertical', color: G.text }}
            />
          </div>
        ) : (
          <div
            onDragOver={e => { e.preventDefault(); setDragOver(true) }}
            onDragLeave={() => setDragOver(false)}
            onDrop={handleDrop}
            onClick={() => inputRef.current?.click()}
            style={{
              border: `2px dashed ${dragOver ? G.blue : G.borderMid}`,
              borderRadius: '10px', padding: '36px 24px', textAlign: 'center', cursor: 'pointer',
              background: dragOver ? G.bluePale : G.bg, transition: 'all 0.15s'
            }}
          >
            <div style={{ fontSize: '28px', marginBottom: '10px' }}>⬆</div>
            <div style={{ fontFamily: G.font, fontSize: '15px', fontWeight: 600, color: G.text, marginBottom: '4px' }}>
              {files.length > 0 ? `${files.length} file${files.length > 1 ? 's' : ''} selected` : `Drop ${tool.multi ? 'files' : 'a file'} here or click to browse`}
            </div>
            <div style={{ fontFamily: G.font, fontSize: '12px', color: G.textMuted }}>
              {files.length > 0
                ? files.map(f => `${f.name} (${formatBytes(f.size)})`).join(', ')
                : `Accepts ${tool.accept} · Max 25MB · Files stay in your browser`}
            </div>
            <input ref={inputRef} type="file" accept={tool.accept} multiple={tool.multi} onChange={e => handleFiles(e.target.files)} style={{ display: 'none' }} />
          </div>
        )}

        {tool.id === 'split-pdf' && files.length > 0 && (
          <div style={{ marginTop: '14px' }}>
            <div style={{ fontFamily: G.font, fontSize: '13px', fontWeight: 600, color: G.text, marginBottom: '6px' }}>Page range to extract</div>
            <input
              type="text"
              value={pageRange}
              onChange={e => setPageRange(e.target.value)}
              placeholder="e.g. 1-3 or 1,3,5"
              style={{ width: '100%', padding: '10px 12px', border: `1px solid ${G.border}`, borderRadius: '7px', fontSize: '13px', fontFamily: G.font, color: G.text }}
            />
            <div style={{ fontFamily: G.font, fontSize: '11px', color: G.textMuted, marginTop: '4px' }}>Use ranges like "1-5" or individual pages like "1,3,7"</div>
          </div>
        )}

        <div style={{ marginTop: '16px', display: 'flex', gap: '10px', alignItems: 'center' }}>
          <button
            onClick={convert}
            disabled={status === 'converting' || (!isTextTool && files.length === 0)}
            style={{ background: G.blue, color: 'white', border: 'none', borderRadius: '8px', padding: '11px 28px', fontSize: '14px', fontWeight: 700, cursor: status === 'converting' || (!isTextTool && files.length === 0) ? 'not-allowed' : 'pointer', fontFamily: G.font, opacity: status === 'converting' || (!isTextTool && files.length === 0) ? 0.6 : 1 }}
          >
            {status === 'converting' ? 'Converting...' : `Convert ${tool.name.split(' ').pop() === 'PDF' ? 'to PDF' : ''}`}
          </button>
          {(files.length > 0 || textContent) && status !== 'converting' && (
            <button onClick={reset} style={{ background: 'transparent', border: `1px solid ${G.border}`, borderRadius: '8px', padding: '11px 18px', fontSize: '13px', fontWeight: 500, cursor: 'pointer', color: G.textMid, fontFamily: G.font }}>
              Reset
            </button>
          )}
        </div>

        {status === 'done' && result && (
          <div style={{ marginTop: '16px', background: G.tealPale, border: `1px solid #9FE1CB`, borderRadius: '10px', padding: '16px 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '10px' }}>
            <div>
              <div style={{ fontFamily: G.font, fontSize: '14px', fontWeight: 700, color: '#085041' }}>✓ Conversion complete!</div>
              <div style={{ fontFamily: G.font, fontSize: '12px', color: '#0F6E56', marginTop: '2px' }}>{result.name} · {formatBytes(result.bytes.byteLength)}</div>
            </div>
            <button
              onClick={() => downloadResult(result)}
              style={{ background: G.teal, color: 'white', border: 'none', borderRadius: '7px', padding: '10px 22px', fontSize: '13px', fontWeight: 700, cursor: 'pointer', fontFamily: G.font }}
            >
              ↓ Download
            </button>
          </div>
        )}

        {status === 'error' && (
          <div style={{ marginTop: '16px', background: G.redPale, border: '1px solid #f09595', borderRadius: '8px', padding: '12px 16px', fontFamily: G.font, fontSize: '13px', color: '#791F1F' }}>
            ⚠ {errorMsg}
          </div>
        )}
      </div>

      <AffiliateCTA tool={tool.id} />
      <AdBanner size="rectangle" />

      <div style={{ marginTop: '28px', background: '#fff', border: `1px solid ${G.border}`, borderRadius: '10px', padding: '20px 24px' }}>
        <div style={{ fontFamily: G.font, fontSize: '14px', fontWeight: 700, color: G.text, marginBottom: '12px' }}>How it works</div>
        {['Select your file — click the upload area or drag and drop.',
          'Click Convert — processing happens instantly in your browser.',
          'Download your file — click the Download button when ready.',
          'Your files are never uploaded to any server. Everything stays on your device.'
        ].map((step, i) => (
          <div key={i} style={{ display: 'flex', gap: '12px', marginBottom: '10px', alignItems: 'flex-start' }}>
            <div style={{ width: '22px', height: '22px', borderRadius: '50%', background: G.bluePale, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '11px', fontWeight: 700, color: G.blue, flexShrink: 0, fontFamily: G.mono }}>{i + 1}</div>
            <div style={{ fontSize: '13px', color: G.textMid, fontFamily: G.font, lineHeight: 1.5 }}>{step}</div>
          </div>
        ))}
      </div>

      <div style={{ marginTop: '24px' }}>
        <div style={{ fontFamily: G.font, fontSize: '14px', fontWeight: 700, color: G.text, marginBottom: '12px' }}>Other tools you might need</div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))', gap: '8px' }}>
          {TOOLS.filter(t => t.id !== toolId).slice(0, 4).map(t => (
            <div key={t.id} onClick={() => setPage('tools/' + t.id)} style={{ background: '#fff', border: `1px solid ${G.border}`, borderRadius: '8px', padding: '12px', cursor: 'pointer' }}>
              <div style={{ fontFamily: G.font, fontSize: '13px', fontWeight: 600, color: G.text }}>{t.name}</div>
              <div style={{ fontFamily: G.font, fontSize: '11px', color: G.textMuted, marginTop: '2px' }}>{t.desc}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

// ─── PAGES ────────────────────────────────────────────────────────────────────
function HomePage({ setPage }) {
  const [cat, setCat] = useState('all')
  const [search, setSearch] = useState('')

  const filtered = TOOLS.filter(t =>
    (cat === 'all' || t.cat === cat) &&
    (!search || t.name.toLowerCase().includes(search.toLowerCase()))
  )

  const iconMap = { 'jpg-to-pdf': '🖼', 'png-to-pdf': '🖼', 'merge-pdf': '📑', 'compress-pdf': '🗜', 'image-compressor': '🗜', 'jpg-png-converter': '🔄', 'word-to-pdf': '📝', 'split-pdf': '✂️', 'webp-to-jpg': '🌐', 'text-to-pdf': '📋' }
  const iconBg = { pdf: G.bluePale, image: G.amberPale }

  return (
    <div>
      <div style={{ background: '#fff', padding: '52px 24px 44px', textAlign: 'center', borderBottom: `1px solid ${G.border}` }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', background: G.bluePale, color: '#3451c7', fontSize: '11px', fontWeight: 700, padding: '4px 14px', borderRadius: '20px', marginBottom: '16px', letterSpacing: '0.2px', fontFamily: G.font }}>
          <span style={{ width: '6px', height: '6px', background: G.blue, borderRadius: '50%', display: 'inline-block' }} />
          100% free — no sign-up required
        </div>
        <h1 style={{ fontFamily: G.font, fontSize: '46px', fontWeight: 700, color: G.navy, lineHeight: 1.05, letterSpacing: '-0.8px', margin: '0 0 10px' }}>
          Convert any file.<br /><span style={{ color: G.blue }}>In seconds.</span>
        </h1>
        <p style={{ fontFamily: G.font, fontSize: '15px', color: G.textMuted, maxWidth: '400px', margin: '0 auto 28px', lineHeight: 1.6 }}>
          Fast, private, and browser-based. Your files never leave your device.
        </p>
        <div style={{ display: 'flex', gap: '8px', maxWidth: '440px', margin: '0 auto', background: '#f4f4f0', padding: '7px', borderRadius: '11px', border: `1px solid ${G.border}` }}>
          <select
            onChange={e => { if (e.target.value) setPage('tools/' + e.target.value) }}
            style={{ flex: 1, background: '#fff', border: `1px solid ${G.border}`, borderRadius: '7px', padding: '10px 12px', fontSize: '13px', fontFamily: G.font, color: G.text }}
          >
            <option value="">Choose a converter...</option>
            {TOOLS.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
          </select>
          <button onClick={() => setPage('tools')} style={{ background: G.blue, color: 'white', border: 'none', borderRadius: '7px', padding: '10px 22px', fontSize: '13px', fontWeight: 700, cursor: 'pointer', fontFamily: G.font }}>
            Go →
          </button>
        </div>
        <div style={{ display: 'flex', gap: '40px', justifyContent: 'center', marginTop: '24px' }}>
          {[['10', 'Free tools'], ['0', 'Sign-ups'], ['100%', 'Browser-based']].map(([n, l]) => (
            <div key={l}>
              <div style={{ fontFamily: G.mono, fontSize: '22px', fontWeight: 500, color: G.navy }}>{n}</div>
              <div style={{ fontFamily: G.font, fontSize: '11px', color: G.textMuted, marginTop: '2px' }}>{l}</div>
            </div>
          ))}
        </div>
      </div>

      <TrustBar />
      <AdBanner />

      <div style={{ maxWidth: '940px', margin: '0 auto', padding: '36px 24px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px', flexWrap: 'wrap', gap: '12px' }}>
          <h2 style={{ fontFamily: G.font, fontSize: '20px', fontWeight: 700, color: G.text, margin: 0 }}>All converters</h2>
          <div style={{ display: 'flex', gap: '6px' }}>
            {[['All', 'all'], ['PDF', 'pdf'], ['Images', 'image']].map(([label, val]) => (
              <button key={val} onClick={() => setCat(val)} style={{ background: cat === val ? G.navy : '#fff', color: cat === val ? '#fff' : G.textMid, border: `1px solid ${cat === val ? G.navy : G.border}`, borderRadius: '20px', padding: '5px 14px', fontSize: '12px', fontWeight: 500, cursor: 'pointer', fontFamily: G.font }}>
                {label}
              </button>
            ))}
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(170px, 1fr))', gap: '10px' }}>
          {filtered.map(t => (
            <div key={t.id} onClick={() => setPage('tools/' + t.id)}
              style={{ background: '#fff', border: `1px solid ${G.border}`, borderRadius: '10px', padding: '16px', cursor: 'pointer', transition: 'border-color 0.15s' }}
              onMouseEnter={e => e.currentTarget.style.borderColor = G.blue}
              onMouseLeave={e => e.currentTarget.style.borderColor = G.border}
            >
              <div style={{ width: '38px', height: '38px', borderRadius: '8px', background: iconBg[t.cat] || G.bluePale, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '18px', marginBottom: '10px' }}>{iconMap[t.id]}</div>
              <div style={{ fontFamily: G.font, fontSize: '13px', fontWeight: 700, color: G.text, marginBottom: '4px' }}>{t.name}</div>
              <div style={{ fontFamily: G.font, fontSize: '11px', color: G.textMuted, lineHeight: 1.4 }}>{t.desc}</div>
              {t.badge && (
                <div style={{ display: 'inline-block', marginTop: '8px', fontSize: '9px', fontWeight: 700, padding: '2px 7px', borderRadius: '4px', background: t.badgeType === 'hot' ? '#fff0ee' : G.bluePale, color: t.badgeType === 'hot' ? G.red : '#3451c7', letterSpacing: '0.3px', textTransform: 'uppercase', fontFamily: G.font }}>
                  {t.badge}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      <AdBanner size="rectangle" />

      <div style={{ maxWidth: '940px', margin: '0 auto', padding: '0 24px 40px' }}>
        <h2 style={{ fontFamily: G.font, fontSize: '20px', fontWeight: 700, color: G.text, marginBottom: '16px' }}>File conversion guides</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: '12px' }}>
          {ARTICLES.slice(0, 4).map(a => (
            <div key={a.id} onClick={() => setPage('guides/' + a.id)} style={{ background: '#fff', border: `1px solid ${G.border}`, borderRadius: '10px', padding: '16px', cursor: 'pointer' }}>
              <span style={{ fontSize: '9px', fontWeight: 700, padding: '3px 8px', borderRadius: '4px', background: a.tagBg, color: '#fff', textTransform: 'uppercase', letterSpacing: '0.3px', fontFamily: G.font }}>{a.tag}</span>
              <div style={{ fontFamily: G.font, fontSize: '14px', fontWeight: 700, color: G.text, margin: '8px 0 5px', lineHeight: 1.3 }}>{a.title}</div>
              <div style={{ fontFamily: G.font, fontSize: '12px', color: G.textMuted, lineHeight: 1.5 }}>{a.excerpt}</div>
              <div style={{ fontFamily: G.font, fontSize: '12px', color: G.blue, marginTop: '10px', fontWeight: 600 }}>Read more →</div>
            </div>
          ))}
        </div>
      </div>

      <div style={{ background: '#fff', borderTop: `1px solid ${G.border}`, borderBottom: `1px solid ${G.border}`, padding: '36px 24px' }}>
        <div style={{ maxWidth: '700px', margin: '0 auto' }}>
          <h2 style={{ fontFamily: G.font, fontSize: '20px', fontWeight: 700, color: G.text, marginBottom: '16px' }}>Frequently asked questions</h2>
          {[
            ['Is ZapConverter really free?', 'Yes — all 10 tools are completely free. No account required, no watermarks, no hidden charges.'],
            ['Are my files safe?', 'Your files never leave your device. All conversion happens in your browser using JavaScript — nothing is uploaded to any server.'],
            ['What file types are supported?', 'PDF, JPG, PNG, WebP, and DOCX. Each tool lists its accepted formats on the tool page.'],
            ['Is there a file size limit?', 'No hard limit, but very large files (100MB+) may be slow to process in older browsers. For most use cases, performance is excellent.'],
            ['Can I use ZapConverter on mobile?', 'Yes — ZapConverter works on any modern browser including Safari on iOS and Chrome on Android.'],
          ].map(([q, a]) => <FAQItem key={q} question={q} answer={a} />)}
        </div>
      </div>
    </div>
  )
}

function FAQItem({ question, answer }) {
  const [open, setOpen] = useState(false)
  return (
    <div style={{ borderBottom: `1px solid ${G.border}`, padding: '14px 0' }}>
      <div onClick={() => setOpen(!open)} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer' }}>
        <span style={{ fontFamily: G.font, fontSize: '14px', fontWeight: 500, color: G.text }}>{question}</span>
        <span style={{ color: G.blue, fontSize: '18px', fontWeight: 700 }}>{open ? '−' : '+'}</span>
      </div>
      {open && <div style={{ fontFamily: G.font, fontSize: '13px', color: G.textMid, lineHeight: 1.7, marginTop: '8px' }}>{answer}</div>}
    </div>
  )
}

function ToolsPage({ setPage }) {
  const iconMap = { 'jpg-to-pdf': '🖼', 'png-to-pdf': '🖼', 'merge-pdf': '📑', 'compress-pdf': '🗜', 'image-compressor': '🗜', 'jpg-png-converter': '🔄', 'word-to-pdf': '📝', 'split-pdf': '✂️', 'webp-to-jpg': '🌐', 'text-to-pdf': '📋' }
  return (
    <div style={{ maxWidth: '940px', margin: '0 auto', padding: '32px 24px' }}>
      <h1 style={{ fontFamily: G.font, fontSize: '32px', fontWeight: 700, color: G.text, marginBottom: '6px', letterSpacing: '-0.4px' }}>All File Converters</h1>
      <p style={{ fontFamily: G.font, fontSize: '14px', color: G.textMuted, marginBottom: '28px' }}>{TOOLS.length} free tools — browser-based, no sign-up</p>
      <AdBanner />
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '12px', marginTop: '20px' }}>
        {TOOLS.map(t => (
          <div key={t.id} onClick={() => setPage('tools/' + t.id)}
            style={{ background: '#fff', border: `1px solid ${G.border}`, borderRadius: '10px', padding: '18px', cursor: 'pointer' }}
            onMouseEnter={e => e.currentTarget.style.borderColor = G.blue}
            onMouseLeave={e => e.currentTarget.style.borderColor = G.border}
          >
            <div style={{ fontSize: '22px', marginBottom: '10px' }}>{iconMap[t.id]}</div>
            <div style={{ fontFamily: G.font, fontSize: '15px', fontWeight: 700, color: G.text, marginBottom: '4px' }}>{t.name}</div>
            <div style={{ fontFamily: G.font, fontSize: '12px', color: G.textMuted, lineHeight: 1.5 }}>{t.desc}</div>
          </div>
        ))}
      </div>
    </div>
  )
}

function GuidesPage({ setPage }) {
  return (
    <div style={{ maxWidth: '900px', margin: '0 auto', padding: '32px 24px' }}>
      <h1 style={{ fontFamily: G.font, fontSize: '32px', fontWeight: 700, color: G.text, marginBottom: '6px', letterSpacing: '-0.4px' }}>File Conversion Guides</h1>
      <p style={{ fontFamily: G.font, fontSize: '14px', color: G.textMuted, marginBottom: '28px' }}>Everything you need to know about converting files — free guides with no fluff.</p>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '14px' }}>
        {ARTICLES.map(a => (
          <div key={a.id} onClick={() => setPage('guides/' + a.id)} style={{ background: '#fff', border: `1px solid ${G.border}`, borderRadius: '10px', padding: '18px', cursor: 'pointer' }}>
            <span style={{ fontSize: '9px', fontWeight: 700, padding: '3px 8px', borderRadius: '4px', background: a.tagBg, color: '#fff', textTransform: 'uppercase', letterSpacing: '0.3px', fontFamily: G.font }}>{a.tag}</span>
            <div style={{ fontFamily: G.font, fontSize: '15px', fontWeight: 700, color: G.text, margin: '8px 0 6px', lineHeight: 1.3 }}>{a.title}</div>
            <div style={{ fontFamily: G.font, fontSize: '12px', color: G.textMuted, lineHeight: 1.5 }}>{a.excerpt}</div>
            <div style={{ fontFamily: G.font, fontSize: '12px', color: G.blue, marginTop: '10px', fontWeight: 600 }}>Read more →</div>
          </div>
        ))}
      </div>
    </div>
  )
}

function ArticlePage({ id, setPage }) {
  const article = ARTICLES.find(a => a.id === id)
  if (!article) return <div style={{ padding: '60px 24px', textAlign: 'center', fontFamily: G.font }}>Article not found. <span onClick={() => setPage('guides')} style={{ color: G.blue, cursor: 'pointer' }}>Back to guides →</span></div>

  const renderContent = (text) => text.split('\n\n').map((block, i) => {
    if (block.startsWith('## ')) return <h2 key={i} style={{ fontFamily: G.font, fontSize: '20px', fontWeight: 700, color: G.text, margin: '28px 0 10px' }}>{block.replace('## ', '')}</h2>
    if (block.startsWith('**')) {
      return (
        <div key={i} style={{ marginBottom: '10px' }}>
          {block.split('\n').map((line, j) => {
            const parts = line.split('**').filter(Boolean)
            return <p key={j} style={{ fontFamily: G.font, fontSize: '14px', color: G.textMid, lineHeight: 1.7, margin: '0 0 4px' }}>
              {parts.map((part, k) => k % 2 === 0 ? <strong key={k}>{part}</strong> : part)}
            </p>
          })}
        </div>
      )
    }
    return <p key={i} style={{ fontFamily: G.font, fontSize: '15px', color: G.textMid, lineHeight: 1.8, margin: '0 0 16px' }}>{block}</p>
  })

  const relatedTool = TOOLS.find(t => article.id.includes(t.id.replace(/-/g, '-')) || t.id.split('-').some(w => article.id.includes(w)))

  return (
    <div style={{ maxWidth: '720px', margin: '0 auto', padding: '32px 24px' }}>
      <div style={{ fontSize: '12px', color: G.textMuted, marginBottom: '8px', fontFamily: G.font }}>
        <span onClick={() => setPage('home')} style={{ cursor: 'pointer', color: G.blue }}>Home</span>
        {' › '}
        <span onClick={() => setPage('guides')} style={{ cursor: 'pointer', color: G.blue }}>Guides</span>
        {' › '}{article.title}
      </div>
      <span style={{ fontSize: '9px', fontWeight: 700, padding: '3px 8px', borderRadius: '4px', background: article.tagBg, color: '#fff', textTransform: 'uppercase', fontFamily: G.font }}>{article.tag}</span>
      <h1 style={{ fontFamily: G.font, fontSize: '32px', fontWeight: 700, color: G.text, margin: '10px 0 6px', lineHeight: 1.15, letterSpacing: '-0.3px' }}>{article.title}</h1>
      <p style={{ fontFamily: G.font, fontSize: '15px', color: G.textMuted, margin: '0 0 24px', lineHeight: 1.6 }}>{article.excerpt}</p>

      {relatedTool && (
        <div style={{ background: G.bluePale, border: `1px solid #c5d0f8`, borderRadius: '10px', padding: '14px 18px', marginBottom: '24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '10px' }}>
          <div style={{ fontFamily: G.font, fontSize: '13px', color: '#3451c7' }}>Ready to convert? Use <strong>{relatedTool.name}</strong> — free, no sign-up.</div>
          <button onClick={() => setPage('tools/' + relatedTool.id)} style={{ background: G.blue, color: 'white', border: 'none', borderRadius: '6px', padding: '8px 16px', fontSize: '12px', fontWeight: 700, cursor: 'pointer', fontFamily: G.font }}>
            Open {relatedTool.name} →
          </button>
        </div>
      )}

      <div style={{ borderTop: `3px solid ${G.blue}`, paddingTop: '24px' }}>
        {renderContent(article.content)}
      </div>

      <AdBanner />

      <AffiliateCTA tool={relatedTool?.id || 'merge-pdf'} />

      <div style={{ marginTop: '32px' }}>
        <div style={{ fontFamily: G.font, fontSize: '16px', fontWeight: 700, color: G.text, marginBottom: '12px' }}>More guides</div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '10px' }}>
          {ARTICLES.filter(a => a.id !== id).slice(0, 3).map(a => (
            <div key={a.id} onClick={() => { setPage('guides/' + a.id); window.scrollTo(0, 0) }} style={{ background: G.bg, border: `1px solid ${G.border}`, borderRadius: '8px', padding: '14px', cursor: 'pointer' }}>
              <span style={{ fontSize: '9px', fontWeight: 700, padding: '2px 7px', borderRadius: '3px', background: a.tagBg, color: '#fff', textTransform: 'uppercase', fontFamily: G.font }}>{a.tag}</span>
              <div style={{ fontFamily: G.font, fontSize: '13px', fontWeight: 700, color: G.text, margin: '7px 0 0', lineHeight: 1.3 }}>{a.title}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

// ─── APP ──────────────────────────────────────────────────────────────────────
export default function App() {
  const [page, setPage] = useState(() => urlToPage(window.location.pathname))

  useEffect(() => {
    const handlePop = () => setPage(urlToPage(window.location.pathname))
    window.addEventListener('popstate', handlePop)
    return () => window.removeEventListener('popstate', handlePop)
  }, [])

  const navigate = (newPage) => {
    window.history.pushState({}, '', pageToUrl(newPage))
    setPage(newPage)
    window.scrollTo(0, 0)
  }

  useEffect(() => {
    if (page.startsWith('tools/')) {
      const id = page.replace('tools/', '')
      const tool = TOOLS.find(t => t.id === id)
      document.title = tool ? `${tool.name} — Free Online Converter | ZapConverter` : 'File Converter | ZapConverter'
    } else if (page.startsWith('guides/')) {
      const id = page.replace('guides/', '')
      const art = ARTICLES.find(a => a.id === id)
      document.title = art ? `${art.title} | ZapConverter` : 'Guide | ZapConverter'
    } else {
      const titles = { home: 'ZapConverter — Free Online File Converter', tools: 'All File Converters | ZapConverter', guides: 'File Conversion Guides | ZapConverter' }
      document.title = titles[page] || 'ZapConverter'
    }
  }, [page])

  const renderPage = () => {
    if (page === 'home') return <HomePage setPage={navigate} />
    if (page === 'tools') return <ToolsPage setPage={navigate} />
    if (page === 'guides') return <GuidesPage setPage={navigate} />
    if (page.startsWith('tools/')) return <ToolPage toolId={page.replace('tools/', '')} setPage={navigate} />
    if (page.startsWith('guides/')) return <ArticlePage id={page.replace('guides/', '')} setPage={navigate} />
    return <HomePage setPage={navigate} />
  }

  return (
    <div style={{ background: G.bg, minHeight: '100vh', fontFamily: G.font }}>
      <Nav page={page} setPage={navigate} />
      {renderPage()}
      <Footer setPage={navigate} />
    </div>
  )
}
