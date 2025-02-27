from PyPDF2 import PdfReader
import textwrap

def extract_text_from_pdf(file, chunk_size=300):
    """Extracts and chunks text from a PDF file."""
    pdf_reader = PdfReader(file)
    full_text = "\n".join([page.extract_text() for page in pdf_reader.pages if page.extract_text()])

    # ✅ Split text into manageable chunks
    chunks = textwrap.wrap(full_text, chunk_size)

    return chunks
