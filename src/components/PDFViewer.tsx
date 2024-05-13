import React from "react";

type Props = { pdf_url: string };

const PDFViewer = ({ pdf_url }: Props) => {
    const encodedUrl = encodeURIComponent(pdf_url);
    console.log(pdf_url);
    return (
        <iframe
        src={`https://docs.google.com/gview?url=${pdf_url}&embedded=true`}
        className="w-full h-full"
        ></iframe>
    );
};

export default PDFViewer;
