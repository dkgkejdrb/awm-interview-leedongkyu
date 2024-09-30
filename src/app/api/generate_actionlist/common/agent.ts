// 에이전트의 파라미터 설정
export const agentParams = {
    model: "gpt-4o",
    role: "user",
    temperature: 1.0,
    max_tokens: 2048,
}

// 이 함수는 completion에서 액션 리스트를 생성
export async function createActionListFromAgent(completionAgent: string) {
    const pattern = /<action>\s*(\w+)\(([^)]+)\)\s*<\/action>/g;
    let match;
    const actionList = [];

    while ((match = pattern.exec(completionAgent)) !== null) {
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
            } else if (!paramsObj.value) {
                paramsObj.value = param.value; // 두 번째는 'value'
            } else if (actionName === 'input_text') {
                paramsObj.text = param.value; // 세 번째는 'text' for input_text
            } else if (actionName === 'wait_for_element' || actionName === 'monitor_file_downloads') {
                paramsObj.timeout = param.value; // 세 번째는 'timeout' for wait_for_element or monitor_file_downloads
            }
        });

        // 액션과 파라미터를 리스트에 추가
        actionList.push({
            action: actionName,
            params: paramsObj
        });
    }

    return actionList;
}