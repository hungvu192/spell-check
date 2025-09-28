import { GoogleGenAI } from "@google/genai";

/**
 * Corrects text using the Gemini API for high-quality, context-aware results.
 * @param text The text to correct.
 * @param whitelist An array of words or phrases to ignore during correction.
 * @param abbreviations A dictionary of abbreviations to expand.
 * @returns The corrected text.
 */
export async function correctTextWithGemini(
    text: string, 
    whitelist: string[] = [],
    abbreviations: Record<string, string> = {}
): Promise<string> {
    // The API key is provided by the execution environment.
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY! });

    let systemInstruction = `Bạn là một trợ lý biên tập chuyên nghiệp, chuyên sửa lỗi chính tả và ngữ pháp tiếng Việt.
Nhiệm vụ của bạn là đọc văn bản được cung cấp và chỉ sửa các lỗi sai.
Quy tắc:
1. Giữ nguyên hoàn toàn văn phong, cấu trúc câu và nội dung gốc của văn bản.
2. Không thêm, bớt hay thay đổi ý nghĩa của câu.
3. Không sáng tạo hay viết lại bất kỳ phần nào của văn bản.
4. Chỉ trả về văn bản đã được sửa lỗi. Không thêm bất kỳ lời giải thích, lời chào, ghi chú hay định dạng markdown nào. Chỉ trả về chuỗi văn bản thuần túy.`;

    if (whitelist.length > 0) {
        const whitelistString = whitelist.map(word => `"${word}"`).join(', ');
        systemInstruction += `\n5. QUAN TRỌNG: KHÔNG ĐƯỢC SỬA những từ hoặc cụm từ sau đây. Giữ nguyên chúng y hệt như trong văn bản gốc: ${whitelistString}.`;
    }

    if (Object.keys(abbreviations).length > 0) {
        const abbreviationString = Object.entries(abbreviations)
            .map(([abbr, expansion]) => `"${abbr}": "${expansion}"`)
            .join(', ');
        systemInstruction += `\n6. MỞ RỘNG TỪ VIẾT TẮT: Dựa vào từ điển sau đây, hãy tìm và thay thế tất cả các từ viết tắt trong văn bản bằng dạng đầy đủ của chúng. Từ điển: {${abbreviationString}}.`;
    }

    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: text,
            config: {
                systemInstruction: systemInstruction,
                temperature: 0, // Use 0 for deterministic and precise corrections
            },
        });

        // Directly return the corrected text from the API response.
        return response.text.trim();
    } catch (error) {
        console.error("Error calling Gemini API:", error);
        // Rethrow a more user-friendly error to be caught by the UI.
        throw new Error("Không thể kết nối đến dịch vụ sửa lỗi AI. Vui lòng thử lại sau.");
    }
}
