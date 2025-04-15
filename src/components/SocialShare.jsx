import React from 'react';
import { FaTwitter, FaWhatsapp, FaLinkedin, FaLink } from 'react-icons/fa';

export default function SocialShare({ streak }) {
  const shareMessage = `I'm on a ${streak}-day habit streak! 🚀 #Productivity #HabitTracker`;
  const shareUrl = window.location.href;
  
  const shareOn = (platform) => {
    const urls = {
      twitter: `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareMessage)}&url=${encodeURIComponent(shareUrl)}`,
      whatsapp: `https://wa.me/?text=${encodeURIComponent(`${shareMessage} ${shareUrl}`)}`,
      linkedin: `https://www.linkedin.com/shareArticle?mini=true&url=${encodeURIComponent(shareUrl)}&title=${encodeURIComponent(`My ${streak}-day habit streak`)}`
    };
    window.open(urls[platform], '_blank');
  };

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(`${shareMessage} ${shareUrl}`);
      alert('Link copied to clipboard!');
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  return (
    <div className="social-share">
      <button onClick={() => shareOn('twitter')} aria-label="Share on Twitter">
        <FaTwitter />
      </button>
      <button onClick={() => shareOn('whatsapp')} aria-label="Share on WhatsApp">
        <FaWhatsapp />
      </button>
      <button onClick={() => shareOn('linkedin')} aria-label="Share on LinkedIn">
        <FaLinkedin />
      </button>
      <button onClick={copyLink} aria-label="Copy share link">
        <FaLink />
      </button>
    </div>
  );
}
