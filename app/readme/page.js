'use client';
import React, { useEffect, useState } from 'react';
import ReactMarkdown from 'react-markdown';

export default function ReadmePage() {
  const [content, setContent] = useState('');

  useEffect(() => {
    fetch('/README.md') // this assumes README.md is in the public folder
      .then((res) => res.text())
      .then((text) => setContent(text));
  }, []);

  return (
    <div className="prose mx-auto p-6 text-white">
      <ReactMarkdown>{content}</ReactMarkdown>
    </div>
  );
}
