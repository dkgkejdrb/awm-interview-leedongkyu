import * as path from 'path';
import * as fs from 'fs';

export const getPrompt = (file: string) => {
    const root = path.join(process.cwd(), 'src/app/api/generate_actionlist');
    const filePath = path.join(root, file);

    try {
        // 파일을 동기적으로 읽기
        const data = fs.readFileSync(filePath, 'utf8');
        return data;
      } catch (err) {
        console.error('파일을 읽는 도중 오류가 발생했습니다:', err);
        throw err;
      }
}

export const getPromptCommonInstruction = () => {
    const filePath = path.join(process.cwd(), 'src/app/api/generate_actionlist/common/prompt/instruction.txt')
    const data = fs.readFileSync(filePath, 'utf8');
    return data;
}