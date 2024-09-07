import fetch from 'node-fetch';
import { FormData, Blob } from 'formdata-node';
import { JSDOM } from 'jsdom';

/**
 * Convert WEBP to MP4 using EZGIF
 * @param {Buffer|String} source - The source WEBP image or URL.
 * @returns {Promise<String>} - The URL of the converted MP4 file.
 */
async function webp2mp4(source) {
  try {
    let form = new FormData();
    let isUrl = typeof source === 'string' && /https?:\/\//.test(source);
    const blob = !isUrl && new Blob([source]);

    form.append('new-image-url', isUrl ? source : '');
    form.append('new-image', isUrl ? '' : blob, 'image.webp');

    let res = await fetch('https://s6.ezgif.com/webp-to-mp4', {
      method: 'POST',
      body: form
    });

    if (!res.ok) throw new Error('Failed to convert WEBP to MP4');

    let html = await res.text();
    let { document } = new JSDOM(html).window;
    let form2 = new FormData();
    let obj = {};

    for (let input of document.querySelectorAll('form input[name]')) {
      obj[input.name] = input.value;
      form2.append(input.name, input.value);
    }

    let res2 = await fetch('https://ezgif.com/webp-to-mp4/' + obj.file, {
      method: 'POST',
      body: form2
    });

    if (!res2.ok) throw new Error('Failed to get MP4 URL');

    let html2 = await res2.text();
    let { document: document2 } = new JSDOM(html2).window;

    let videoUrl = document2.querySelector('div#output > p.outfile > video > source')?.src;

    if (!videoUrl) throw new Error('MP4 URL not found');

    return new URL(videoUrl, res2.url).toString();
  } catch (error) {
    console.error('Error in webp2mp4:', error);
    throw error;
  }
}

/**
 * Convert WEBP to PNG using EZGIF
 * @param {Buffer|String} source - The source WEBP image or URL.
 * @returns {Promise<String>} - The URL of the converted PNG file.
 */
async function webp2png(source) {
  try {
    let form = new FormData();
    let isUrl = typeof source === 'string' && /https?:\/\//.test(source);
    const blob = !isUrl && new Blob([source]);

    form.append('new-image-url', isUrl ? source : '');
    form.append('new-image', isUrl ? '' : blob, 'image.webp');

    let res = await fetch('https://s6.ezgif.com/webp-to-png', {
      method: 'POST',
      body: form
    });

    if (!res.ok) throw new Error('Failed to convert WEBP to PNG');

    let html = await res.text();
    let { document } = new JSDOM(html).window;
    let form2 = new FormData();
    let obj = {};

    for (let input of document.querySelectorAll('form input[name]')) {
      obj[input.name] = input.value;
      form2.append(input.name, input.value);
    }

    let res2 = await fetch('https://ezgif.com/webp-to-png/' + obj.file, {
      method: 'POST',
      body: form2
    });

    if (!res2.ok) throw new Error('Failed to get PNG URL');

    let html2 = await res2.text();
    let { document: document2 } = new JSDOM(html2).window;

    let imageUrl = document2.querySelector('div#output > p.outfile > img')?.src;

    if (!imageUrl) throw new Error('PNG URL not found');

    return new URL(imageUrl, res2.url).toString();
  } catch (error) {
    console.error('Error in webp2png:', error);
    throw error;
  }
}

export {
  webp2mp4,
  webp2png
}
