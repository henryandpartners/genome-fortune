/**
 * PALM ANALYSIS ENGINE
 * Canvas-based palm line detection using Sobel edge detection.
 * Analyzes hand shape, line strength, and color distribution.
 */

class PalmAnalysis {
    constructor() {
        this.handShapeTypes = {
            earth: { ratio: [0.8, 1.0], desc: 'Earth Hand — practical, grounded, hardworking. You build with your hands and trust tangible results.' },
            air:   { ratio: [1.0, 1.15], desc: 'Air Hand — intellectual, communicative, analytical. You think before you act and excel in dialogue.' },
            water: { ratio: [1.15, 1.5], desc: 'Water Hand — emotional, intuitive, creative. You feel deeply and navigate by instinct.' },
            fire:  { ratio: [0.8, 1.15], desc: 'Fire Hand — energetic, passionate, impulsive. You act with intensity and inspire others.' }
        };

        this.lineReadings = {
            strong: { lifeLine: 'Strong vitality and physical energy. Your life force is robust.', heartLine: 'Deep emotional capacity. You love with intensity.', headLine: 'Sharp intellect. Clear thinking guides your decisions.', fateLine: 'Strong sense of purpose. Your career path is clearly defined.' },
            weak: { lifeLine: 'Energy fluctuates — conserve and restore regularly.', heartLine: 'Emotional subtlety — you love quietly but deeply.', headLine: 'Intuitive thinking over logic — trust your gut.', fateLine: 'Flexible path — you adapt your purpose as you grow.' },
            none: { lifeLine: 'Unable to detect life line — try a clearer palm image.', heartLine: 'Heart line not clearly visible in this scan.', headLine: 'Head line detection inconclusive.', fateLine: 'Fate line not detected — it may be faint or absent.' }
        };
    }

    /**
     * Convert ImageData to grayscale array
     */
    _toGrayscale(imageData, width, height) {
        const data = imageData.data;
        const gray = new Float32Array(width * height);
        for (let i = 0; i < width * height; i++) {
            gray[i] = 0.299 * data[i * 4] + 0.587 * data[i * 4 + 1] + 0.114 * data[i * 4 + 2];
        }
        return gray;
    }

    /**
     * Sobel edge detection
     * Returns edge magnitude array
     */
    _sobel(gray, width, height) {
        const edges = new Float32Array(width * height);
        const gx = [[-1, 0, 1], [-2, 0, 2], [-1, 0, 1]];
        const gy = [[-1, -2, -1], [0, 0, 0], [1, 2, 1]];

        for (let y = 1; y < height - 1; y++) {
            for (let x = 1; x < width - 1; x++) {
                let sumX = 0, sumY = 0;
                for (let ky = -1; ky <= 1; ky++) {
                    for (let kx = -1; kx <= 1; kx++) {
                        const pixel = gray[(y + ky) * width + (x + kx)];
                        sumX += pixel * gx[ky + 1][kx + 1];
                        sumY += pixel * gy[ky + 1][kx + 1];
                    }
                }
                edges[y * width + x] = Math.sqrt(sumX * sumX + sumY * sumY);
            }
        }
        return edges;
    }

    /**
     * Detect hand region and calculate dimensions
     */
    _detectHandRegion(gray, width, height) {
        // Simple approach: find the bounding box of non-background pixels
        // Assume background is significantly darker or lighter than skin
        const threshold = 40; // pixels darker than this are background

        // Calculate average brightness to determine background
        let totalBrightness = 0;
        let count = 0;
        for (let i = 0; i < gray.length; i += 10) {
            totalBrightness += gray[i];
            count++;
        }
        const avgBrightness = totalBrightness / count;

        // Find bounds
        let minX = width, minY = height, maxX = 0, maxY = 0;
        for (let y = 0; y < height; y++) {
            for (let x = 0; x < width; x++) {
                const val = gray[y * width + x];
                // Skin is typically brighter than dark background
                if (val > avgBrightness * 0.3 && val < avgBrightness * 3) {
                    if (x < minX) minX = x;
                    if (x > maxX) maxX = x;
                    if (y < minY) minY = y;
                    if (y > maxY) maxY = y;
                }
            }
        }

        const handWidth = maxX - minX;
        const handHeight = maxY - minY;

        return { minX, minY, handWidth, handHeight, centerX: (minX + maxX) / 2, centerY: (minY + maxY) / 2 };
    }

    /**
     * Calculate average edge strength in a region
     */
    _regionEdgeStrength(edges, width, height, cx, cy, radius) {
        let sum = 0, count = 0;
        const r2 = radius * radius;

        for (let dy = -radius; dy <= radius; dy++) {
            for (let dx = -radius; dx <= radius; dx++) {
                if (dx * dx + dy * dy > r2) continue;
                const px = Math.round(cx + dx);
                const py = Math.round(cy + dy);
                if (px >= 0 && px < width && py >= 0 && py < height) {
                    sum += edges[py * width + px];
                    count++;
                }
            }
        }

        return count > 0 ? (sum / count) : 0;
    }

    /**
     * Normalize edge strength to percentage
     */
    _normalizeStrength(raw, maxExpected) {
        const pct = Math.min(100, Math.round((raw / maxExpected) * 100));
        return Math.max(5, pct); // minimum 5%
    }

    /**
     * Analyze palm image
     */
    analyze(imageData) {
        if (!imageData) {
            return {
                handShape: 'Unknown',
                handShapeType: null,
                dominantColor: 'N/A',
                lineStrength: { lifeLine: 0, heartLine: 0, headLine: 0, fateLine: 0 },
                readings: {
                    combined: 'Upload a palm image for topography analysis. Place your open palm flat against a contrasting background for best results.'
                },
                analysisNote: 'No image provided'
            };
        }

        const width = imageData.width;
        const height = imageData.height;

        // Convert to grayscale
        const gray = this._toGrayscale(imageData, width, height);

        // Sobel edge detection
        const edges = this._sobel(gray, width, height);

        // Detect hand region
        const handRegion = this._detectHandRegion(gray, width, height);

        // Determine hand shape
        let handShapeType = 'Unknown';
        let handShapeDesc = '';
        if (handRegion.handWidth > 10 && handRegion.handHeight > 10) {
            const ratio = handRegion.handHeight / handRegion.handWidth;
            if (ratio < 1.0) {
                handShapeType = 'Earth';
                handShapeDesc = this.handShapeTypes.earth.desc;
            } else if (ratio < 1.15) {
                handShapeType = 'Air';
                handShapeDesc = this.handShapeTypes.air.desc;
            } else {
                handShapeType = 'Water';
                handShapeDesc = this.handShapeTypes.water.desc;
            }
        }

        // Calculate dominant color (average RGB of hand region)
        let rSum = 0, gSum = 0, bSum = 0, pxCount = 0;
        const { minX, minY, handWidth, handHeight } = handRegion;
        const step = 4; // sample every 4th pixel
        for (let y = minY; y < minY + handHeight; y += step) {
            for (let x = minX; x < minX + handWidth; x += step) {
                if (y < height && x < width) {
                    const idx = (y * width + x) * 4;
                    rSum += imageData.data[idx];
                    gSum += imageData.data[idx + 1];
                    bSum += imageData.data[idx + 2];
                    pxCount++;
                }
            }
        }
        const dominantColor = pxCount > 0
            ? `RGB(${Math.round(rSum/pxCount)}, ${Math.round(gSum/pxCount)}, ${Math.round(bSum/pxCount)})`
            : 'Unknown';

        // Detect palm lines (approximate positions based on hand region)
        const cx = handRegion.centerX;
        const cy = handRegion.centerY;
        const maxEdge = Math.max(...edges) || 1;

        // Life line: curves around the base of the thumb (lower-left quadrant)
        const lifeLineX = cx - handWidth * 0.15;
        const lifeLineY = cy + handHeight * 0.2;
        const lifeLineRaw = this._regionEdgeStrength(edges, width, height, lifeLineX, lifeLineY, handWidth * 0.25);

        // Heart line: upper portion of palm, horizontal
        const heartLineX = cx;
        const heartLineY = cy - handHeight * 0.15;
        const heartLineRaw = this._regionEdgeStrength(edges, width, height, heartLineX, heartLineY, handWidth * 0.3);

        // Head line: middle of palm, horizontal
        const headLineX = cx;
        const headLineY = cy;
        const headLineRaw = this._regionEdgeStrength(edges, width, height, headLineX, headLineY, handWidth * 0.3);

        // Fate line: vertical through center
        const fateLineX = cx;
        const fateLineY = cy;
        const fateLineRaw = this._regionEdgeStrength(edges, width, height, fateLineX, fateLineY, handWidth * 0.15, handHeight * 0.3);

        const lifeStrength = this._normalizeStrength(lifeLineRaw, maxEdge);
        const heartStrength = this._normalizeStrength(heartLineRaw, maxEdge);
        const headStrength = this._normalizeStrength(headLineRaw, maxEdge);
        const fateStrength = this._normalizeStrength(fateLineRaw, maxEdge);

        // Generate readings
        const readings = {
            lifeLine: lifeStrength > 30 ? this.lineReadings.strong.lifeLine : (lifeStrength > 10 ? this.lineReadings.weak.lifeLine : this.lineReadings.none.lifeLine),
            heartLine: heartStrength > 30 ? this.lineReadings.strong.heartLine : (heartStrength > 10 ? this.lineReadings.weak.heartLine : this.lineReadings.none.heartLine),
            headLine: headStrength > 30 ? this.lineReadings.strong.headLine : (headStrength > 10 ? this.lineReadings.weak.headLine : this.lineReadings.none.headLine),
            fateLine: fateStrength > 30 ? this.lineReadings.strong.fateLine : (fateStrength > 10 ? this.lineReadings.weak.fateLine : this.lineReadings.none.fateLine)
        };

        const combined = `Hand Shape: ${handShapeType}\n${handShapeDesc}\n\nLife Line (${lifeStrength}%): ${readings.lifeLine}\nHeart Line (${heartStrength}%): ${readings.heartLine}\nHead Line (${headStrength}%): ${readings.headLine}\nFate Line (${fateStrength}%): ${readings.fateLine}`;

        return {
            handShape: `${handRegion.handWidth}×${handRegion.handHeight}px`,
            handShapeType,
            dominantColor,
            lineStrength: {
                lifeLine: lifeStrength,
                heartLine: heartStrength,
                headLine: headStrength,
                fateLine: fateStrength
            },
            readings
        };
    }
}

if (typeof module !== 'undefined' && module.exports) { module.exports = PalmAnalysis; }
