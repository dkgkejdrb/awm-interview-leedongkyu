import OpenAI from "openai";
import { getPrompt } from "../../common/getPrompt";
import { getPromptCommonInstruction } from "../../common/getPrompt";
import { agentParams, createActionListFromAgent } from "../../common/agent";

const openai = new OpenAI();

const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

import { NextResponse } from 'next/server';

export async function POST(request: Request) {

    async function run() {
        const INSTRUCTION = getPromptCommonInstruction();
        const HTML = await request.text();
        const ONE_SHOT = getPrompt('manager/orders/prompt/one-shot.txt');
        
        const prompt = INSTRUCTION + HTML + ONE_SHOT;

        const completion = await openai.chat.completions.create(
        {
            model: agentParams.model,
            messages: [{ "role": "user", "content": prompt }],
            temperature: agentParams.temperature,
            max_tokens: agentParams.max_tokens,
        }
        );

        console.log(completion.choices[0].message.content);
        
        // completion과 choices가 null이 아닌지 확인
        if (!completion || !completion.choices || !completion.choices[0].message || !completion.choices[0].message.content) {
            throw new Error("Invalid completion response from OpenAI API.");
        }

        // 액션 리스트 생성
        const actionList = await createActionListFromAgent(completion.choices[0].message.content);
        // console.log(actionList);

        // JSON => String 출력
        // return NextResponse.json({ message: JSON.stringify(actionList, null, 2) });
        // JSON 출력
        return NextResponse.json({ message: actionList });
    }

    return await run()
}
