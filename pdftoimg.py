import os
import json
import boto3
import tempfile
from pdf2image import convert_from_path
from requests_toolbelt.multipart import decoder

s3 = boto3.client('s3')
BUCKET = os.environ.get('OUTPUT_BUCKET', 'pdf2img-outputs')

def lambda_handler(event, context):
    # Decode multipart/form-data
    content_type = event['headers'].get('content-type') or event['headers'].get('Content-Type')
    body = event['body']
    if event.get('isBase64Encoded'):
        import base64
        body = base64.b64decode(body)
    multipart_data = decoder.MultipartDecoder(body, content_type)
    pdf_file = None
    for part in multipart_data.parts:
        if b'application/pdf' in part.headers.get(b'Content-Type', b''):
            pdf_file = part.content
            break
    if not pdf_file:
        return {
            "statusCode": 400,
            "body": json.dumps({"error": "No PDF file found."}),
            "headers": {"Content-Type": "application/json"}
        }

    # Save PDF to temp file
    with tempfile.NamedTemporaryFile(suffix=".pdf", delete=False) as temp_pdf:
        temp_pdf.write(pdf_file)
        temp_pdf_path = temp_pdf.name

    # Convert PDF to images
    try:
        images = convert_from_path(temp_pdf_path, fmt='png')
        image_urls = []
        for idx, img in enumerate(images):
            with tempfile.NamedTemporaryFile(suffix=".png", delete=False) as temp_img:
                img.save(temp_img.name, 'PNG')
                key = f"converted/{os.path.basename(temp_pdf_path)}_page_{idx+1}.png"
                s3.upload_file(temp_img.name, BUCKET, key, ExtraArgs={'ContentType': 'image/png', 'ACL': 'public-read'})
                url = f"https://{BUCKET}.s3.amazonaws.com/{key}"
                image_urls.append(url)
        return {
            "statusCode": 200,
            "body": json.dumps({"images": image_urls}),
            "headers": {"Content-Type": "application/json"}
        }
    except Exception as e:
        return {
            "statusCode": 500,
            "body": json.dumps({"error": str(e)}),
            "headers": {"Content-Type": "application/json"}
        }
    finally:
        os.remove(temp_pdf_path)