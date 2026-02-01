import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaTimes, FaDownload, FaShare, FaWhatsapp, FaTwitter, FaLinkedin, FaTelegram, FaQrcode, FaImage } from 'react-icons/fa';
import QRCode from "react-qr-code";
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-hot-toast';

const ShareCardModal = ({ isOpen, onClose, link }) => {
    const { user } = useAuth();
    const [selectedStyle, setSelectedStyle] = useState('neon');
    const [activeTab, setActiveTab] = useState('card'); // 'card' or 'qr'
    const [isGenerating, setIsGenerating] = useState(false);
    const canvasRef = useRef(null);
    const [canvasDataUrl, setCanvasDataUrl] = useState(null);

    // Modern card style definitions
    const cardStyles = {
        neon: {
            name: 'Neon',
            bgColors: ['#0f0f23', '#1a1a2e', '#16213e'],
            accentColor: '#00d4ff',
            accentGlow: '#00d4ff',
            cardBg: 'rgba(255, 255, 255, 0.03)',
            textColor: '#ffffff',
            subtextColor: 'rgba(255, 255, 255, 0.6)',
            tagBg: 'rgba(0, 212, 255, 0.15)',
            tagText: '#00d4ff',
        },
        aurora: {
            name: 'Aurora',
            bgColors: ['#1a1a2e', '#16213e', '#0f3460'],
            accentColor: '#e94560',
            accentGlow: '#e94560',
            cardBg: 'rgba(255, 255, 255, 0.05)',
            textColor: '#ffffff',
            subtextColor: 'rgba(255, 255, 255, 0.6)',
            tagBg: 'rgba(233, 69, 96, 0.15)',
            tagText: '#e94560',
        },
        mint: {
            name: 'Mint',
            bgColors: ['#0d1117', '#161b22', '#21262d'],
            accentColor: '#58a6ff',
            accentGlow: '#58a6ff',
            cardBg: 'rgba(255, 255, 255, 0.03)',
            textColor: '#f0f6fc',
            subtextColor: '#8b949e',
            tagBg: 'rgba(88, 166, 255, 0.15)',
            tagText: '#58a6ff',
        },
        sunset: {
            name: 'Sunset',
            bgColors: ['#2d1b4e', '#4a1942', '#6b2737'],
            accentColor: '#ff6b6b',
            accentGlow: '#ff6b6b',
            cardBg: 'rgba(255, 255, 255, 0.05)',
            textColor: '#ffffff',
            subtextColor: 'rgba(255, 255, 255, 0.6)',
            tagBg: 'rgba(255, 107, 107, 0.15)',
            tagText: '#ff6b6b',
        },
        forest: {
            name: 'Forest',
            bgColors: ['#0d1b0d', '#1a2f1a', '#234523'],
            accentColor: '#4ade80',
            accentGlow: '#4ade80',
            cardBg: 'rgba(255, 255, 255, 0.03)',
            textColor: '#ffffff',
            subtextColor: 'rgba(255, 255, 255, 0.6)',
            tagBg: 'rgba(74, 222, 128, 0.15)',
            tagText: '#4ade80',
        },
        royal: {
            name: 'Royal',
            bgColors: ['#1a0a2e', '#2d1b4e', '#4a1f6b'],
            accentColor: '#a78bfa',
            accentGlow: '#a78bfa',
            cardBg: 'rgba(255, 255, 255, 0.05)',
            textColor: '#ffffff',
            subtextColor: 'rgba(255, 255, 255, 0.6)',
            tagBg: 'rgba(167, 139, 250, 0.15)',
            tagText: '#a78bfa',
        },
    };

    const getDomain = (url) => {
        try {
            return new URL(url).hostname.replace('www.', '');
        } catch {
            return url;
        }
    };

    const formatDate = (date) => {
        return new Date(date).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric'
        });
    };

    // Helper to draw rounded rectangle
    const roundRect = (ctx, x, y, w, h, r) => {
        ctx.beginPath();
        ctx.moveTo(x + r, y);
        ctx.lineTo(x + w - r, y);
        ctx.quadraticCurveTo(x + w, y, x + w, y + r);
        ctx.lineTo(x + w, y + h - r);
        ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
        ctx.lineTo(x + r, y + h);
        ctx.quadraticCurveTo(x, y + h, x, y + h - r);
        ctx.lineTo(x, y + r);
        ctx.quadraticCurveTo(x, y, x + r, y);
        ctx.closePath();
    };

    // Draw modern card on canvas
    const drawCard = () => {
        if (!link || !canvasRef.current) return;

        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        const style = cardStyles[selectedStyle];
        const scale = 2;

        // Larger card dimensions for more content
        const width = 440 * scale;
        const height = 340 * scale;
        canvas.width = width;
        canvas.height = height;
        ctx.scale(scale, scale);

        // Draw gradient background
        const bgGradient = ctx.createLinearGradient(0, 0, 440, 340);
        bgGradient.addColorStop(0, style.bgColors[0]);
        bgGradient.addColorStop(0.5, style.bgColors[1]);
        bgGradient.addColorStop(1, style.bgColors[2]);

        roundRect(ctx, 0, 0, 440, 340, 20);
        ctx.fillStyle = bgGradient;
        ctx.fill();

        // Draw subtle pattern/noise effect (dots)
        ctx.fillStyle = 'rgba(255, 255, 255, 0.02)';
        for (let i = 0; i < 50; i++) {
            const x = Math.random() * 440;
            const y = Math.random() * 340;
            ctx.beginPath();
            ctx.arc(x, y, Math.random() * 2, 0, Math.PI * 2);
            ctx.fill();
        }

        // Draw accent glow circle (top right)
        const glowGradient = ctx.createRadialGradient(380, 60, 0, 380, 60, 120);
        glowGradient.addColorStop(0, style.accentGlow + '30');
        glowGradient.addColorStop(0.5, style.accentGlow + '10');
        glowGradient.addColorStop(1, 'transparent');
        ctx.fillStyle = glowGradient;
        ctx.fillRect(260, -60, 240, 240);

        // Draw second glow (bottom left)
        const glowGradient2 = ctx.createRadialGradient(60, 280, 0, 60, 280, 100);
        glowGradient2.addColorStop(0, style.accentGlow + '20');
        glowGradient2.addColorStop(1, 'transparent');
        ctx.fillStyle = glowGradient2;
        ctx.fillRect(-40, 180, 200, 200);

        // Draw main card container (smaller inner box)
        roundRect(ctx, 28, 50, 384, 220, 16);
        ctx.fillStyle = style.cardBg;
        ctx.fill();
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.08)';
        ctx.lineWidth = 1;
        ctx.stroke();

        // Draw Ledgerly logo inside inner box at top right corner
        ctx.fillStyle = style.accentColor;
        ctx.font = 'bold 12px system-ui, -apple-system, sans-serif';
        ctx.textAlign = 'right';
        ctx.textBaseline = 'middle';
        ctx.fillText('Ledgerly', 390, 72);

        // Draw icon with glow effect
        const iconX = 48;
        const iconY = 70

        // Icon glow
        const iconGlow = ctx.createRadialGradient(iconX + 28, iconY + 28, 0, iconX + 28, iconY + 28, 40);
        iconGlow.addColorStop(0, style.accentColor + '40');
        iconGlow.addColorStop(1, 'transparent');
        ctx.fillStyle = iconGlow;
        ctx.fillRect(iconX - 12, iconY - 12, 80, 80);

        // Icon background
        roundRect(ctx, iconX, iconY, 56, 56, 14);
        ctx.fillStyle = style.accentColor + '20';
        ctx.fill();
        ctx.strokeStyle = style.accentColor + '40';
        ctx.lineWidth = 1.5;
        ctx.stroke();

        // Icon letter
        ctx.fillStyle = style.accentColor;
        ctx.font = 'bold 26px system-ui, -apple-system, sans-serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(link.title?.[0]?.toUpperCase() || '?', iconX + 28, iconY + 28);

        // Draw title next to icon (larger)
        ctx.fillStyle = style.textColor;
        ctx.font = 'bold 22px system-ui, -apple-system, sans-serif';
        ctx.textAlign = 'left';
        ctx.textBaseline = 'middle';
        const title = link.title || 'Untitled';
        const truncatedTitle = title.length > 24 ? title.slice(0, 24) + '...' : title;
        ctx.fillText(truncatedTitle, 116, 98);

        // Draw star if starred
        if (link.isStarred) {
            ctx.fillStyle = '#fbbf24';
            ctx.font = '18px system-ui';
            ctx.textAlign = 'right';
            ctx.fillText('⭐', 396, 78);
        }

        // Draw domain/URL below title (moved lower)
        ctx.fillStyle = style.subtextColor;
        ctx.font = '15px system-ui, -apple-system, sans-serif';
        ctx.textAlign = 'left';
        const domain = getDomain(link.url);
        ctx.fillText('🔗 ' + (domain.length > 36 ? domain.slice(0, 36) + '...' : domain), 48, 155);

        // Draw date below link (more spacing)
        ctx.fillStyle = style.subtextColor;
        ctx.font = '14px system-ui, -apple-system, sans-serif';
        ctx.fillText(formatDate(link.createdAt), 48, 182);

        let contentY = 206;

        // Draw description if exists
        if (link.description) {
            ctx.fillStyle = style.subtextColor;
            ctx.font = '14px system-ui, -apple-system, sans-serif';
            const desc = link.description;
            const maxDescWidth = 350;
            let descY = contentY;
            const descWords = desc.split(' ');
            let descLine = '';
            let descLineCount = 0;

            for (let word of descWords) {
                const testLine = descLine + word + ' ';
                if (ctx.measureText(testLine).width > maxDescWidth && descLine !== '') {
                    ctx.fillText(descLine.trim(), 48, descY);
                    descLine = word + ' ';
                    descY += 20;
                    descLineCount++;
                    if (descLineCount >= 2) break;
                } else {
                    descLine = testLine;
                }
            }
            if (descLineCount < 2) {
                const finalDesc = descLine.trim();
                ctx.fillText(descLineCount === 1 && descLine.length < desc.length ? finalDesc + '...' : finalDesc, 48, descY);
            }
        }

        // Draw tags (larger)
        if (link.tags && link.tags.length > 0) {
            let tagX = 48;
            const tagY = 230;
            ctx.font = '12px system-ui, -apple-system, sans-serif';

            const tagsToShow = link.tags.slice(0, 4);
            tagsToShow.forEach((tag, index) => {
                const tagText = '#' + tag;
                const tagWidth = ctx.measureText(tagText).width + 16;

                if (tagX + tagWidth > 320) return;

                // Tag background
                roundRect(ctx, tagX, tagY, tagWidth, 24, 6);
                ctx.fillStyle = style.tagBg;
                ctx.fill();

                // Tag text
                ctx.fillStyle = style.tagText;
                ctx.textAlign = 'left';
                ctx.textBaseline = 'middle';
                ctx.fillText(tagText, tagX + 8, tagY + 12);

                tagX += tagWidth + 8;
            });

            if (link.tags.length > 4) {
                ctx.fillStyle = style.subtextColor;
                ctx.fillText(`+${link.tags.length - 4}`, tagX + 4, tagY + 10);
            }
        }

        // Draw user name on bottom left
        const userName = user?.name || user?.username || 'Ledgerly User';
        ctx.fillStyle = style.subtextColor;
        ctx.font = '12px system-ui, -apple-system, sans-serif';
        ctx.textAlign = 'left';
        ctx.textBaseline = 'middle';
        ctx.fillText('Shared by ' + userName, 32, 312);

        // Draw "Saved with Ledgerly" on bottom right (no dot)
        ctx.fillStyle = style.subtextColor;
        ctx.font = '12px system-ui, -apple-system, sans-serif';
        ctx.textAlign = 'right';
        ctx.textBaseline = 'middle';
        ctx.fillText('Saved with Ledgerly', 408, 312);

        // Update preview
        setCanvasDataUrl(canvas.toDataURL('image/png'));
    };

    // Redraw when style or link changes
    useEffect(() => {
        if (isOpen && link) {
            setTimeout(drawCard, 50);
        }
    }, [isOpen, link, selectedStyle, user]);

    const handleDownload = () => {
        setIsGenerating(true);

        try {
            if (activeTab === 'card') {
                if (!canvasRef.current) return;
                const dataUrl = canvasRef.current.toDataURL('image/png');
                const downloadLink = document.createElement('a');
                downloadLink.href = dataUrl;
                downloadLink.download = `${link.title.slice(0, 30).replace(/[^a-zA-Z0-9]/g, '_')}_card.png`;
                downloadLink.click();
            } else {
                // Download QR Code
                const svg = document.getElementById("qr-code-svg");
                const svgData = new XMLSerializer().serializeToString(svg);
                const canvas = document.createElement("canvas");
                const ctx = canvas.getContext("2d");
                const img = new Image();
                img.onload = () => {
                    canvas.width = img.width;
                    canvas.height = img.height;
                    ctx.drawImage(img, 0, 0);
                    const pngFile = canvas.toDataURL("image/png");
                    const downloadLink = document.createElement("a");
                    downloadLink.href = pngFile;
                    downloadLink.download = `${link.title.slice(0, 30)}_qr.png`;
                    downloadLink.click();
                };
                img.src = "data:image/svg+xml;base64," + btoa(svgData);
            }
        } catch (error) {
            console.error('Error downloading:', error);
            toast.error('Failed to download image');
        } finally {
            setIsGenerating(false);
        }
    };

    // Build share message with all details (no emojis for compatibility)
    const buildShareMessage = () => {
        const userName = user?.name || user?.username || 'Someone';
        let message = `*${link.title}*\n\n`;

        if (link.description) {
            message += `${link.description}\n\n`;
        }

        message += `Link: ${link.url}\n\n`;

        message += `---\n`;
        message += `Shared by ${userName} via Ledgerly\n`;
        message += `Save & organize your links: ledgerly.app`;

        return message;
    };

    const handleShare = async (platform) => {
        const shareMessage = buildShareMessage();
        const encodedText = encodeURIComponent(shareMessage);
        const encodedUrl = encodeURIComponent(link.url);
        const encodedTitle = encodeURIComponent(link.title);

        const shareUrls = {
            whatsapp: `https://wa.me/?text=${encodedText}`,
            twitter: `https://twitter.com/intent/tweet?text=${encodeURIComponent(link.title)}&url=${encodedUrl}`,
            linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`,
            telegram: `https://t.me/share/url?url=${encodedUrl}&text=${encodedText}`,
        };

        if (shareUrls[platform]) {
            window.open(shareUrls[platform], '_blank', 'width=600,height=400');
        }
    };

    const handleNativeShare = async () => {
        if (!navigator.share) {
            toast.error('Native sharing not supported on this device');
            return;
        }

        const shareMessage = buildShareMessage();

        try {
            if (canvasRef.current && navigator.canShare) {
                const blob = await new Promise(resolve => {
                    canvasRef.current.toBlob(resolve, 'image/png');
                });

                const file = new File([blob], 'ledgerly-link-card.png', { type: 'image/png' });
                const shareData = {
                    title: link.title,
                    text: shareMessage,
                    files: [file]
                };

                if (navigator.canShare(shareData)) {
                    await navigator.share(shareData);
                    return;
                }
            }

            // Fallback without image
            await navigator.share({
                title: link.title,
                text: shareMessage,
                url: link.url,
            });
        } catch (error) {
            if (error.name !== 'AbortError') {
                console.error('Error sharing:', error);
            }
        }
    };

    if (!link) return null;

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 z-50 flex items-center justify-center p-4 pl-20"
                    onClick={onClose}
                >
                    {/* Backdrop */}
                    <div className="absolute inset-0 bg-black/80 backdrop-blur-md" />

                    {/* Modal - Horizontal layout */}
                    <motion.div
                        initial={{ scale: 0.9, opacity: 0, y: 20 }}
                        animate={{ scale: 1, opacity: 1, y: 0 }}
                        exit={{ scale: 0.9, opacity: 0, y: 20 }}
                        transition={{ type: 'spring', damping: 25, stiffness: 300 }}
                        onClick={(e) => e.stopPropagation()}
                        className="relative bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl w-full max-w-5xl overflow-hidden shadow-2xl"
                    >
                        {/* Header */}
                        <div className="flex items-center justify-between px-6 py-4 border-b border-white/5">
                            <div>
                                <h2 className="text-lg font-bold text-white flex items-center gap-2">
                                    Share Link
                                </h2>
                                <p className="text-gray-500 text-xs mt-0.5">Share this resource with others</p>
                            </div>

                            {/* Tabs */}
                            <div className="flex bg-white/5 p-1 rounded-xl">
                                <button
                                    onClick={() => setActiveTab('card')}
                                    className={`flex items-center gap-2 px-4 py-1.5 rounded-lg text-sm font-medium transition-all ${activeTab === 'card' ? 'bg-blue-600 text-white shadow-lg' : 'text-gray-400 hover:text-white'}`}
                                >
                                    <FaImage size={12} /> Card
                                </button>
                                <button
                                    onClick={() => setActiveTab('qr')}
                                    className={`flex items-center gap-2 px-4 py-1.5 rounded-lg text-sm font-medium transition-all ${activeTab === 'qr' ? 'bg-blue-600 text-white shadow-lg' : 'text-gray-400 hover:text-white'}`}
                                >
                                    <FaQrcode size={12} /> QR Code
                                </button>
                            </div>

                            <button
                                onClick={onClose}
                                className="p-2 hover:bg-white/5 rounded-xl transition-colors group"
                            >
                                <FaTimes className="text-gray-500 group-hover:text-white transition-colors" />
                            </button>
                        </div>

                        {/* Content - Horizontal layout */}
                        <div className="flex gap-8 p-6">
                            {/* Left side - Card Preview or QR */}
                            <div className="flex-shrink-0">
                                <div className="flex justify-center items-center p-4 bg-black/30 rounded-2xl border border-white/5 min-w-[480px] min-h-[370px]">
                                    {activeTab === 'card' ? (
                                        <>
                                            <canvas
                                                ref={canvasRef}
                                                style={{ display: 'none' }}
                                            />
                                            {canvasDataUrl && (
                                                <img
                                                    src={canvasDataUrl}
                                                    alt="Card Preview"
                                                    className="rounded-2xl"
                                                    style={{
                                                        width: '440px',
                                                        maxWidth: '100%',
                                                        height: 'auto',
                                                        boxShadow: `0 20px 60px rgba(0,0,0,0.5), 0 0 40px ${cardStyles[selectedStyle].accentColor}20`
                                                    }}
                                                />
                                            )}
                                        </>
                                    ) : (
                                        <div
                                            className="p-6 rounded-2xl shadow-2xl flex flex-col items-center justify-center text-center border border-white/10 relative overflow-hidden"
                                            style={{
                                                background: `linear-gradient(135deg, ${cardStyles[selectedStyle].bgColors[0]}, ${cardStyles[selectedStyle].bgColors[1]})`,
                                                minWidth: '320px',
                                                minHeight: '400px'
                                            }}
                                        >
                                            {/* Background Pattern */}
                                            <div className="absolute inset-0 opacity-10"
                                                style={{ backgroundImage: 'radial-gradient(circle, #ffffff 1px, transparent 1px)', backgroundSize: '20px 20px' }}
                                            />

                                            <div className="relative z-10 w-full flex flex-col items-center">
                                                <h3 className="text-xl font-bold mb-6 tracking-wide" style={{ color: cardStyles[selectedStyle].accentColor }}>
                                                    Ledgerly
                                                </h3>

                                                <div className="bg-white p-3 rounded-xl shadow-lg mb-6">
                                                    <div style={{ height: "auto", margin: "0 auto", maxWidth: 180, width: "100%" }}>
                                                        <QRCode
                                                            id="qr-code-svg"
                                                            size={256}
                                                            style={{ height: "auto", maxWidth: "100%", width: "100%" }}
                                                            value={link.url}
                                                            viewBox={`0 0 256 256`}
                                                            bgColor="#ffffff"
                                                            fgColor="#000000"
                                                        />
                                                    </div>
                                                </div>

                                                <p className="font-bold text-lg mb-1 truncate w-full px-4" style={{ color: cardStyles[selectedStyle].textColor }}>
                                                    {link.title}
                                                </p>
                                                <p className="text-xs truncate max-w-[240px]" style={{ color: cardStyles[selectedStyle].subtextColor }}>
                                                    {link.url.replace(/^https?:\/\//, '')}
                                                </p>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Right side - Options */}
                            <div className="flex-1 flex flex-col gap-4">
                                {/* Style Selector */}
                                <div>
                                    <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2 block">Card Theme</label>
                                    <div className="flex flex-wrap gap-2">
                                        {Object.entries(cardStyles).map(([key, style]) => (
                                            <button
                                                key={key}
                                                onClick={() => setSelectedStyle(key)}
                                                className="group relative"
                                            >
                                                <div
                                                    className={`px-3 py-2 rounded-lg text-sm font-medium transition-all ${selectedStyle === key
                                                        ? 'text-white shadow-lg'
                                                        : 'text-gray-400 hover:text-white bg-white/5 hover:bg-white/10'
                                                        }`}
                                                    style={{
                                                        backgroundColor: selectedStyle === key ? style.accentColor : undefined,
                                                        boxShadow: selectedStyle === key ? `0 4px 20px ${style.accentColor}40` : undefined,
                                                    }}
                                                >
                                                    {style.name}
                                                </div>
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                {/* Share to Apps */}
                                <div>
                                    <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2 block">Quick Share</label>
                                    <div className="flex flex-wrap gap-2">
                                        <button
                                            onClick={() => handleShare('whatsapp')}
                                            className="flex items-center gap-2 px-3 py-2 bg-blue-500/10 hover:bg-blue-500/20 text-blue-400 rounded-lg text-sm font-medium transition-all hover:scale-105"
                                        >
                                            <FaWhatsapp size={16} />
                                            WhatsApp
                                        </button>
                                        <button
                                            onClick={() => handleShare('twitter')}
                                            className="flex items-center gap-2 px-3 py-2 bg-blue-500/10 hover:bg-blue-500/20 text-blue-400 rounded-lg text-sm font-medium transition-all hover:scale-105"
                                        >
                                            <FaTwitter size={16} />
                                            Twitter
                                        </button>
                                        <button
                                            onClick={() => handleShare('linkedin')}
                                            className="flex items-center gap-2 px-3 py-2 bg-blue-500/10 hover:bg-blue-500/20 text-blue-400 rounded-lg text-sm font-medium transition-all hover:scale-105"
                                        >
                                            <FaLinkedin size={16} />
                                            LinkedIn
                                        </button>
                                        <button
                                            onClick={() => handleShare('telegram')}
                                            className="flex items-center gap-2 px-3 py-2 bg-blue-500/10 hover:bg-blue-500/20 text-blue-400 rounded-lg text-sm font-medium transition-all hover:scale-105"
                                        >
                                            <FaTelegram size={16} />
                                            Telegram
                                        </button>
                                    </div>
                                </div>

                                {/* Action Buttons */}
                                <div className="flex gap-3 mt-auto pt-3">
                                    {typeof navigator !== 'undefined' && navigator.share && (
                                        <button
                                            onClick={handleNativeShare}
                                            className="flex items-center gap-2 px-4 py-2.5 bg-white/5 hover:bg-white/10 text-white rounded-xl font-medium transition-all"
                                        >
                                            <FaShare size={14} />
                                            More
                                        </button>
                                    )}
                                    <button
                                        onClick={handleDownload}
                                        disabled={isGenerating}
                                        className="flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold transition-all disabled:opacity-50 hover:scale-105"
                                        style={{
                                            background: `linear-gradient(135deg, ${cardStyles[selectedStyle].accentColor}, ${cardStyles[selectedStyle].accentColor}cc)`,
                                            color: '#fff',
                                            boxShadow: `0 4px 20px ${cardStyles[selectedStyle].accentColor}40`,
                                        }}
                                    >
                                        {isGenerating ? (
                                            <>
                                                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                                Generating...
                                            </>
                                        ) : (
                                            <>
                                                <FaDownload size={14} />
                                                Download {activeTab === 'card' ? 'Card' : 'QR'}
                                            </>
                                        )}
                                    </button>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default ShareCardModal;
