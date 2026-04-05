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
    title: 'How to Convert JPG to PDF (Free, Fast, No Sign-Up)',
    tag: 'GUIDE', tagBg: G.blue,
    excerpt: 'Turn one or multiple JPG images into a PDF in seconds — no software, no account, and no watermark.',
    content: `Converting JPG to PDF is one of the most common file tasks online. People do it for school forms, receipts, job applications, invoices, scanned pages, and photo attachments. The easiest approach is to use a browser-based converter that works instantly and does not require an account.

## Why convert JPG to PDF?

PDF is easier to share, print, and submit than a loose image file. A PDF also keeps everything together in one document, which is useful when you have multiple pages or want a more professional file format.

## How to convert JPG to PDF

Open ZapConverter's JPG to PDF tool. Select one JPG or upload multiple JPG files at once. Arrange them in the order you want. Click convert. Download the finished PDF.

## Why this method is easier

You do not need Adobe Acrobat, Microsoft Office, or any desktop software. ZapConverter works directly in your browser, so the process is fast and simple.

## Best results tips

Use the original image instead of a screenshot whenever possible. If you are combining several images into one PDF, name them in order before uploading so your pages stay organized.

## Frequently Asked Questions

**Is JPG to PDF free?**
Yes. ZapConverter lets you convert JPG to PDF for free with no sign-up.

**Can I convert multiple JPG files into one PDF?**
Yes. Upload multiple JPG images and they can be combined into one PDF document.

**Will the image quality drop?**
In most cases, no. Starting with a high-quality image gives you the best result.

**Is it safe to convert JPG to PDF online?**
ZapConverter runs in your browser, so your files stay on your device.`,
  },
  {
    id: 'how-to-convert-jpg-to-pdf-on-iphone',
    title: 'How to Convert JPG to PDF on iPhone',
    tag: 'GUIDE', tagBg: G.blue,
    excerpt: 'A quick step-by-step guide for turning JPG images into PDFs on iPhone using a browser or built-in iOS tools.',
    content: `If you need to send a photo as a PDF from your iPhone, you have two easy options: use an online converter in Safari or use the built-in iPhone print-to-PDF method.

## Convert JPG to PDF on iPhone with ZapConverter

Open Safari and go to ZapConverter. Tap the JPG to PDF tool. Choose your image from Photos or Files. Tap convert, then save or share the finished PDF.

## Built-in iPhone method

Open the Photos app and choose your image. Tap Share, then tap Print. On the print preview screen, zoom in on the preview with two fingers. iPhone will open it as a PDF. Then tap Share again to save it to Files or send it.

## Which option is better?

The built-in method is fine for one image. ZapConverter is better if you want to combine multiple JPG files into one PDF or use the same workflow on desktop and mobile.

## When people usually need this

This is common for school assignments, signed forms, ID images, invoices, and document uploads that only accept PDF.

## Frequently Asked Questions

**Can I turn a JPEG into a PDF on my phone?**
Yes. You can do it with Safari using ZapConverter or with iPhone's built-in print-to-PDF feature.

**Do I need an app?**
No. You can do it without installing anything.

**Can I combine multiple photos into one PDF on iPhone?**
Yes. A browser-based tool is the easiest way to combine several JPG files into one PDF.

**Does iPhone lower image quality when saving as PDF?**
Quality depends on the original image. Using the original photo gives the best result.`,
  },
  {
    id: 'how-to-convert-jpg-to-pdf-on-android',
    title: 'How to Convert JPG to PDF on Android',
    tag: 'GUIDE', tagBg: G.blue,
    excerpt: 'Convert JPG to PDF on Android in a few taps using Chrome or your phone’s built-in print tools.',
    content: `Android makes it easy to create a PDF from an image, but the fastest method is usually a browser-based converter. That gives you a cleaner workflow and makes it easier to combine several images into one file.

## Convert JPG to PDF using Chrome

Open Chrome on your Android phone and visit ZapConverter. Open the JPG to PDF tool. Upload your image, tap convert, and download your PDF.

## Built-in Android option

Many Android phones let you open an image, choose Share or Print, then save the output as a PDF. The exact steps vary by device and Android version.

## Why browser-based conversion is easier

It works across different phones, does not require an app, and is usually better if you have more than one image.

## Good use cases

This is useful for document uploads, expense receipts, shipping paperwork, school forms, and application files.

## Frequently Asked Questions

**Can I convert JPG to PDF on Android for free?**
Yes. You can do it in Chrome with ZapConverter for free.

**Do I need to install a JPG to PDF app?**
No. A browser-based converter works fine for most people.

**Can Android save pictures as PDF?**
Yes. Some Android devices have a built-in save-as-PDF option through print features.

**Can I combine multiple JPG files into one PDF on Android?**
Yes. Upload multiple files in the JPG to PDF tool and combine them into one document.`,
  },
  {
    id: 'jpg-to-pdf-without-losing-quality',
    title: 'How to Convert JPG to PDF Without Losing Quality',
    tag: 'GUIDE', tagBg: G.teal,
    excerpt: 'Keep your images sharp when turning JPG files into PDF by using the right workflow and avoiding common mistakes.',
    content: `One of the biggest concerns people have with JPG to PDF conversion is quality loss. In most cases, blurry output comes from the original file, not the PDF itself.

## Why JPG to PDF can look blurry

If your JPG is already compressed, cropped, or downloaded at low resolution, the PDF will reflect that. A PDF cannot magically restore missing detail.

## Best way to keep quality high

Start with the original JPG file. Avoid screenshots if possible. Use a converter that does not aggressively recompress images. Convert first, then compress only if you need a smaller file size.

## When to compress after conversion

If the final PDF is too large for email or uploads, use a separate PDF compression step after conversion. That gives you more control over the quality-size tradeoff.

## Good workflow

Original JPG in. Convert to PDF. Check quality. Only compress if necessary.

## Frequently Asked Questions

**Does converting JPG to PDF reduce quality?**
Not necessarily. Quality depends mostly on the source image and the converter settings.

**Why is my JPG blurry after converting to PDF?**
Usually because the original JPG was low resolution or already compressed.

**Should I compress the JPG before making a PDF?**
Usually no. Convert first, then compress the PDF only if needed.

**What file type is best for sharp documents?**
For scanned forms and photos, a high-quality JPG can work well. For graphics and screenshots, PNG may look even better before converting to PDF.`,
  },
  {
    id: 'multiple-jpg-to-one-pdf',
    title: 'How to Convert Multiple JPGs Into One PDF',
    tag: 'GUIDE', tagBg: G.blue,
    excerpt: 'Combine several JPG images into one clean PDF for forms, scans, receipts, or photo pages.',
    content: `If you have several JPG images and need one PDF instead of separate files, the easiest solution is to merge them during conversion.

## Why combine JPG files into one PDF?

A single PDF is easier to upload, email, organize, and print than a folder full of separate image files. It is especially useful for receipts, contracts, scanned pages, application documents, and photo sets.

## How to do it

Open ZapConverter's JPG to PDF tool. Select all of your JPG files at once. Keep them in the correct order. Click convert. Download one combined PDF.

## Tips for page order

Rename files before uploading if page order matters. For example: page-1, page-2, page-3.

## When this is most useful

This is ideal for scanned paperwork, photo proof documents, homework pages, expense reports, or any situation where one PDF is easier to handle than many JPG images.

## Frequently Asked Questions

**Can I merge multiple JPG files into one PDF?**
Yes. Upload multiple files and combine them in one conversion.

**Will each JPG become its own page?**
Yes. Typically each image becomes a separate PDF page.

**Can I change the order of images?**
Yes. The upload order determines page order, so name files clearly before uploading.

**Is there a watermark?**
No. ZapConverter does not add a watermark to your PDF.`,
  },
  {
    id: 'jpg-vs-pdf-which-is-better',
    title: 'JPG vs PDF: Which Format Is Better?',
    tag: 'COMPARE', tagBg: G.navy,
    excerpt: 'Understand when JPG makes more sense, when PDF is better, and why people often convert between the two.',
    content: `JPG and PDF serve different purposes. JPG is an image format. PDF is a document format. One is better for pictures, while the other is usually better for sharing finished files.

## When JPG is better

JPG is better for photos, web uploads, image editing, and quick sharing. It is widely supported and usually has a smaller file size than PNG for photos.

## When PDF is better

PDF is better for formal sharing, printing, applications, receipts, scanned paperwork, and documents with multiple pages. It looks more professional and stays consistent across devices.

## Why people convert JPG to PDF

Many upload portals only accept PDF. People also want to combine several images into one document instead of sending many separate files.

## Best rule of thumb

Use JPG when the file is mainly an image. Use PDF when the file needs to behave like a document.

## Frequently Asked Questions

**Should I save as JPG or PDF?**
Use JPG for images and PDF for document-style sharing or printing.

**Is PDF better quality than JPG?**
Not automatically. PDF is just a container format. Quality depends on the image inside it.

**Why do schools and job sites ask for PDF instead of JPG?**
Because PDF is easier to standardize, view, and store.

**Can I turn a JPG into a PDF for free?**
Yes. ZapConverter lets you do that instantly in your browser.`,
  },
  {
    id: 'convert-jpg-to-pdf-free-no-watermark',
    title: 'Convert JPG to PDF Free (No Watermark, No Sign-Up)',
    tag: 'GUIDE', tagBg: G.blue,
    excerpt: 'What to look for in a free JPG to PDF tool — and how to avoid hidden limits, watermarks, and forced sign-ups.',
    content: `A lot of file converters claim to be free, but many add watermarks, cap your daily usage, or ask you to create an account before downloading the result. That is frustrating when you just need one quick conversion.

## What a truly free converter should offer

No sign-up. No watermark. Fast conversion. Clean output. A simple interface. And ideally, files that stay on your device for better privacy.

## Why no watermark matters

Watermarks make the result look unprofessional. That is a problem if you are submitting forms, invoices, resumes, school files, or client paperwork.

## Why no sign-up matters

If a tool forces you to create an account before downloading, that slows down the experience and usually signals an upsell flow.

## What ZapConverter does differently

ZapConverter is built for instant use. Open the JPG to PDF tool, upload your image, convert it, and download the file. No account needed.

## Frequently Asked Questions

**Can I convert JPG to PDF for free with no watermark?**
Yes. ZapConverter gives you a clean PDF without a watermark.

**Do I need to make an account?**
No. You can use the tool without signing up.

**Are there hidden limits?**
The tool is designed for fast everyday use with no forced login flow.

**Is free JPG to PDF safe?**
It is safest when conversion happens in your browser and files are not uploaded to a server.`,
  },
  {
    id: 'jpg-to-pdf-under-100kb',
    title: 'How to Convert JPG to PDF Under 100KB',
    tag: 'FIX', tagBg: G.red,
    excerpt: 'Need a very small PDF for email or uploads? Here is the best way to get JPG to PDF under 100KB.',
    content: `Getting a PDF under 100KB is possible, but it depends on the size and resolution of the original image. If the JPG is large, a tiny PDF target may require extra compression.

## Best workflow

First convert the JPG to PDF. Then compress the PDF. This works better than trying to over-compress the JPG before conversion.

## What affects final PDF size

Image resolution, image dimensions, and the number of pages all matter. A large, detailed photo is harder to squeeze under 100KB than a simple black-and-white document image.

## How to improve your chances

Use a smaller source image. Crop unnecessary space. Avoid combining many images into one PDF if the size limit is strict.

## Realistic expectations

For one simple document photo, under 100KB may be possible. For multiple pages or high-resolution photos, it may not be realistic without visible quality loss.

## Frequently Asked Questions

**Can I make a PDF under 100KB from a JPG?**
Sometimes, yes. It depends on the source image and how much compression is acceptable.

**Should I compress before or after converting?**
Usually after converting. Convert JPG to PDF first, then compress the PDF.

**Why is my PDF still too large?**
The source image may be too detailed or high resolution for such a small file target.

**What is the best use case for a 100KB PDF?**
Simple forms, ID images, and lightweight uploads with strict file size limits.`,
  },
  {
    id: 'is-it-safe-to-convert-jpg-to-pdf-online',
    title: 'Is It Safe to Convert JPG to PDF Online?',
    tag: 'EXPLAINED', tagBg: G.teal,
    excerpt: 'A plain-English guide to the privacy and security side of online file converters.',
    content: `People often worry about file privacy when using online converters, and that concern is reasonable. Some sites upload your files to their servers, while others process everything in your browser.

## The safest kind of converter

A browser-based converter is the safest option because your file stays on your device. That lowers the privacy risk compared with services that require file uploads.

## What to check before using any converter

Look for HTTPS. Look for a clear privacy promise. Avoid sites that force account creation for simple tasks. Be cautious with sensitive files if the site does not explain how processing works.

## Good files vs sensitive files

For casual images, most users just want convenience. For IDs, financial records, medical paperwork, or private contracts, local browser processing is much better.

## How ZapConverter handles privacy

ZapConverter is built around browser-based conversion. That means your JPG stays on your device during the conversion process.

## Frequently Asked Questions

**Can a JPG to PDF website see my files?**
Some can if they upload files to a server. A browser-based converter reduces that risk.

**Is HTTPS enough?**
HTTPS helps protect transfer, but it does not solve privacy if the site still stores your file on a server.

**Should I use online converters for sensitive files?**
Only if the site clearly states that files stay on your device or are deleted immediately after processing.

**Is ZapConverter safer than upload-based converters?**
For privacy, yes. Browser-based processing is the stronger approach.`,
  },
  {
    id: 'best-jpg-to-pdf-settings-high-quality',
    title: 'Best JPG to PDF Settings for High Quality',
    tag: 'GUIDE', tagBg: G.blue,
    excerpt: 'Use the right source images and workflow to get cleaner, sharper JPG to PDF results.',
    content: `If you want a sharp PDF, the most important settings are not hidden in a complicated menu. They come down to source image quality, page order, and whether you compress afterward.

## Start with the best source file

Use the original JPG whenever possible. Avoid images sent through messaging apps if they were compressed. A high-resolution original file gives the best output.

## Keep images organized

If you are converting several JPG files into one PDF, put them in the correct order before uploading. This is especially important for scanned pages.

## Avoid unnecessary compression

If the PDF looks good, leave it alone. Only use PDF compression if you need a smaller file for email or a form upload.

## Use the right image type

For photos, JPG is usually fine. For screenshots, text-heavy graphics, or images with sharp edges, PNG may sometimes look better before converting to PDF.

## Frequently Asked Questions

**What is the best resolution for JPG to PDF?**
Higher-resolution source images usually produce the best PDF result.

**Should I use JPG or PNG before converting to PDF?**
Use JPG for photos. Use PNG for screenshots or graphics when sharp edges matter.

**Why does my PDF look worse than the original image?**
Usually because the original image was compressed, resized, or captured at low quality.

**Can I keep high quality and still reduce file size?**
Yes, but there is always a tradeoff. Convert first, then apply light PDF compression only if needed.`,
  },
  {
    id: 'how-to-merge-pdf-files',
    title: 'How to Merge PDF Files for Free (2026)',
    tag: 'GUIDE', tagBg: G.blue,
    excerpt: 'Combine multiple PDF files into one document — no Adobe Acrobat, no account, completely free.',
    content: `Merging PDF files is one of the most useful PDF tasks because it turns scattered documents into one clean file.

## How to merge PDF files

Open the Merge PDF tool. Select all the PDFs you want to combine. Make sure they are in the right order. Click convert and download the merged file.

## When this is useful

This is helpful for combining invoices, scanned pages, reports, contracts, and application documents.

## Good tip

If your merged file becomes too large for email, run it through a PDF compression tool afterward.

## Frequently Asked Questions

**Can I merge PDFs for free?**
Yes. ZapConverter lets you merge PDFs for free.

**Will page quality change?**
No. Merging PDFs should keep the original pages intact.

**Do I need Adobe Acrobat?**
No. A browser-based tool is enough for simple PDF merging.

**Can I merge many PDFs at once?**
Yes, as long as your browser can handle the files smoothly.`,
  },
  {
    id: 'how-to-compress-pdf',
    title: 'How to Compress a PDF File (Without Losing Quality)',
    tag: 'GUIDE', tagBg: G.teal,
    excerpt: 'Reduce PDF file size for email and upload limits without ruining readability.',
    content: `PDF compression helps when your file is too large for email, uploads, or online forms.

## Why PDFs get large

Most oversized PDFs are large because they contain high-resolution images or scanned pages.

## How to compress a PDF

Open the Compress PDF tool. Upload the PDF. Run compression. Download the smaller version.

## Best use case

This is perfect after JPG to PDF conversion if you need to hit a strict upload size.

## Frequently Asked Questions

**Will compression ruin the file?**
Usually no. Light compression often keeps documents readable.

**Can I compress a PDF for free?**
Yes. ZapConverter offers a free PDF compression tool.

**Should I compress before emailing?**
Yes, especially if your attachment is over the email limit.

**Can I compress scanned PDFs?**
Yes. That is one of the most common use cases.`,
  },
  {
    id: 'how-to-convert-word-to-pdf',
    title: 'How to Convert Word to PDF Free (Without Microsoft Office)',
    tag: 'GUIDE', tagBg: G.blue,
    excerpt: 'Convert a DOCX file to PDF without needing Microsoft Word installed — free and instant.',
    content: `You do not need Microsoft Word installed to turn a DOCX file into PDF.

## How to convert Word to PDF

Open the Word to PDF tool. Upload your DOCX file. Click convert. Download the PDF.

## Why people do this

PDF is easier to share because the layout stays consistent across devices.

## Frequently Asked Questions

**Can I convert Word to PDF without Office?**
Yes. ZapConverter can handle that in your browser.

**Will formatting stay the same?**
Basic formatting usually carries over well, though complex documents may vary.

**Is it free?**
Yes.

**Is it safe?**
Yes. Browser-based conversion keeps files on your device.`,
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
          {ARTICLES.slice(0, 8).map(a => (
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
          {ARTICLES.slice(0, 8).map(a => (
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
            ['Can I convert JPG to PDF for free?', 'Yes. ZapConverter lets you convert JPG to PDF for free with no sign-up and no watermark.'],
            ['How do I convert JPG to PDF on iPhone?', 'Open ZapConverter in Safari, upload your JPG image, convert it, and save the finished PDF.'],
            ['How do I convert JPG to PDF on Android?', 'Open ZapConverter in Chrome, choose your JPG file, convert it, and download the PDF.'],
            ['Can I combine multiple JPG files into one PDF?', 'Yes. Upload multiple JPG images at once and turn them into one PDF document.'],
            ['Will JPG to PDF reduce image quality?', 'Usually no. The best results come from starting with the original high-quality image.'],
            ['Is it safe to convert JPG to PDF online?', 'Yes, especially when conversion happens in your browser and files do not get uploaded to a server.'],
            ['Can I make a JPG to PDF under 100KB?', 'Sometimes. It depends on the original image size and how much compression is acceptable after conversion.'],
            ['Can I use ZapConverter on mobile?', 'Yes. ZapConverter works on modern mobile browsers including Safari on iPhone and Chrome on Android.'],
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

  const renderInline = (line) => {
    const parts = line.split('**')
    return parts.map((part, idx) => idx % 2 === 1 ? <strong key={idx}>{part}</strong> : <span key={idx}>{part}</span>)
  }

  const renderContent = (text) => text.split('\n\n').map((block, i) => {
    if (block.startsWith('## ')) return <h2 key={i} style={{ fontFamily: G.font, fontSize: '20px', fontWeight: 700, color: G.text, margin: '28px 0 10px' }}>{block.replace('## ', '')}</h2>
    const lines = block.split('\n')
    const isList = lines.every(line => /^([0-9]+\.|-|\*)\s/.test(line.trim()))
    if (isList) {
      return (
        <ol key={i} style={{ fontFamily: G.font, fontSize: '15px', color: G.textMid, lineHeight: 1.8, margin: '0 0 16px 20px', padding: 0 }}>
          {lines.map((line, j) => <li key={j} style={{ marginBottom: '6px' }}>{renderInline(line.replace(/^([0-9]+\.|-|\*)\s/, ''))}</li>)}
        </ol>
      )
    }
    if (block.includes('**')) {
      return (
        <div key={i} style={{ marginBottom: '10px' }}>
          {lines.map((line, j) => <p key={j} style={{ fontFamily: G.font, fontSize: '14px', color: G.textMid, lineHeight: 1.7, margin: '0 0 4px' }}>{renderInline(line)}</p>)}
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
