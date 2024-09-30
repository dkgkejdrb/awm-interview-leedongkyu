import * as fs from 'fs';
import * as path from 'path';
import OpenAI from "openai";
const openai = new OpenAI();

const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

const getPropmt = (file: string) => {
    const filePath = path.join(process.cwd(), 'src/app/api/generate_prompt/prompt', file);
    try {
        // 파일을 동기적으로 읽기
        const data = fs.readFileSync(filePath, 'utf8');
        return data;
      } catch (err) {
        console.error('파일을 읽는 도중 오류가 발생했습니다:', err);
        throw err;
      }
}

const filePath = path.join(process.cwd(), 'src/app/api/generate_prompt/prompt', 'instruction.txt');
import { NextResponse } from 'next/server';

export async function POST(request: Request) {

    async function run() {
        const INSTRUCTION =  getPropmt('instruction.txt');
        // const ONE_SHOT =  getPropmt('one-shot.txt');
        const ONE_SHOT =  getPropmt('one-shot-2.txt');
        const prompt = INSTRUCTION + ONE_SHOT;

        const completion = await openai.chat.completions.create({
            model: "gpt-4o",
            messages: [{"role": "user", "content": prompt}],
            temperature: 1.0,
            max_tokens: 2048,
        });

        // console.log(completion.choices[0].message);
        

        // 액션과 파라미터를 추출하는 정규식
        const pattern = /<action>\s*(\w+)\(([^)]+)\)\s*<\/action>/g;
        let match;
        const actionList = [];

        // 매칭된 액션들을 하나씩 처리
        if (typeof (completion.choices[0].message.content) === 'string') {
            while ((match = pattern.exec(completion.choices[0].message.content)) !== null) {
                const actionName = match[1]; // 액션 이름
                const paramsString = match[2]; // 파라미터 문자열

                // 파라미터를 쉼표로 분리하여 key-value로 변환
                const paramsArray = paramsString.split(', ').map(param => {
                    const [key, value] = param.includes('=') ? param.split('=') : [null, param];
                    return {
                        key: key ? key.trim() : null,
                        value: value.trim().replace(/^["']|["']$/g, '') // 앞뒤 따옴표 제거
                    };
                });

                // 파라미터를 객체로 변환
                const paramsObj: any = {};
                paramsArray.forEach(param => {
                    if (param.key) {
                        paramsObj[param.key] = param.value;
                    } else if (!paramsObj.by) {
                        paramsObj.by = param.value; // 첫 번째는 'by'
                    } else {
                        paramsObj.value = param.value; // 두 번째는 'value'
                    }
                });

                // 액션과 파라미터를 리스트에 추가
                actionList.push({
                    action: actionName,
                    params: paramsObj
                });
            }

            // JSON 출력
            console.log(JSON.stringify(actionList, null, 2));
        }
        



        return NextResponse.json({ message: "여기에 결과 리턴" });
    }

    return await run()
}
