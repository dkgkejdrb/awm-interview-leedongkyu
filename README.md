## 1. 프로젝트 개요

이 프로젝트는 **GPT-4o** 기반 웹 크롤링 시나리오를 위한 프롬프트 엔지니어링과, 해당 프롬프트를 테스트하는 RESTful API 서버를 개발하는 것을 목표로 합니다. 

프롬프트 엔지니어링은 AWM(Agent Workflow Memory)을 참고했으며,  API 서버는 Typescript와 Next.js를 사용하여 익숙한 도구를 사용하여 개발했습니다.

### 요구사항

- Node.js (최소 v14.0.0 이상)
- npm (Node Package Manager)



### 개발 도구

- IDE: Visual Studio Code
- 언어: Typescript
- 프레임워크: Next.js

----

## 2. 설치 및 실행 방법

### Node.js 설치

이 프로젝트를 실행하려면 Node.js가 필요합니다. Node.js와 함께 npm도 자동으로 설치됩니다. 이미 PC에 Node.js가 설치되어 있다면, 해당 단계를 스킵하세요.

1. #### Node.js 다운로드

   Node.js 공식 웹사이트에 접속하여 운영 체제에 맞는 최신 LTS(Long Term Support) 버전을 다운로드합니다.

   

2. #### 설치 실행

   다운로드한 설치 파일을 실행하고 안내에 따라 설치를 완료합니다.

   

3. #### 설치 확인

   터미널(명령 프롬프트)에서 다음 명령어를 입력하여 Node.js와 npm이 올바르게 설치되었는지 확인합니다.

   ```bash
   node -v
   npm -v
   ```

   위 명령어가 각각 Node.js와 npm의 버전을 출력하면, 설치가 성공적으로 완료된 것 입니다.



### 프로젝트 설치 및 실행

1. #### 다운로드

   프로젝트를 다운로드하여 원하는 경로에 압축 해제합니다.

   

2. #### 패키지 설치

   프로젝트의 의존성 패키지를 설치합니다.

   ```bash
   npm install
   ```

   

3. #### 개발 서버 실행

   개발 환경에서 앱을 실행하기 위해 다음 명령어를 입력합니다. 실행 후, 브라우저에서 http://localhost:3000/ 을 열어 다음과 같은 화면을 확인했다면, 서버로 API를 호출할 수 있습니다.

   ```bash
   npm run dev
   ```

![](https://codetutorbot.blob.core.windows.net/image/101.png)

-----

## 3. 프로젝트 구조

### `src/app/api` : API 루트 디렉터리

- **`common`** : 서버에서 공통으로 사용하는 리소스 보관
  - **`agent.ts`** : GPT-4 에이전트를 활용한 파라미터 설정 및 completion 결과로부터 액션 리스트를 생성하는 함수 포함
  - **`getPrompt.ts`** : 주요 프롬프트(`instruction.txt`) 및 각 워크플로우별 프롬프트(`one-shot.txt`)를 동기적으로 읽어오는 함수 포함
  - **`prompt`**
    - **`instruction.txt`** : 에이전트의 역할, 작업(Task), 목표, 요구 사항을 정의하는 메인 프롬프트로, 모든 워크플로우에서 공통으로 사용

---

- **`login`** : 로그인 워크플로우 액션 리스트 생성
  - **`prompt`**
    - **`one-shot.txt`** : 로그인 워크플로우에 대한 예시 프롬프트
  - **`route.ts`** : 로그인 액션 리스트 생성 요청/응답을 처리하는 API 로직

---

- **`manager`**

  - **`orders`** : 주문 페이지로 이동하는 액션 리스트 생성
    - **`prompt`**
      - **`one-shot.txt`** : 주문 페이지 이동을 위한 워크플로우 프롬프트
    - **`route.ts`** : 주문 페이지 이동 액션 리스트 API 로직
  
    - **`search`** : 주문 페이지에서 검색 액션 리스트 생성
      - **`prompt`**
        - **`one-shot.txt`** : 주문 검색을 위한 프롬프트
      - **`route.ts`** : 검색 액션 리스트 API 로직

    - **`download`** : 주문 페이지에서 주문 내역을 다운로드하는 액션 리스트 생성
      - **`prompt`**
        - **`one-shot.txt`** : 주문 다운로드 워크플로우 프롬프트
      - **`route.ts`** : 다운로드 액션 리스트 API 로직

---

## 4. API  가이드

본 API는 클라이언트가 제공한 HTML 코드 스니펫과 프롬프트를 기반으로, 해당 HTML 페이지에 맞는 워크플로우 액션 리스트를 생성하여 JSON 형식으로 반환합니다.

GPT-4 모델을 활용해 HTML을 분석하고, 로그인 및 주문 관리와 같은 주요 작업에 필요한 액션을 추출합니다.

API는 총 4개의 엔드포인트로 구성되며, 각 엔드포인트는 다음과 같은 워크플로우를 처리합니다:

1. 로그인
2. 로그인 후 Manager 페이지로 이동
3. 주문 페이지에서 검색
4. 검색 결과 다운로드 (.excel)

각 API는 해당 워크플로우에 맞는 HTML 코드를 제공해야 정확한 액션 리스트를 반환합니다.

| No.  | Title                                             | Endpoint                                                     |
| ---- | ------------------------------------------------- | ------------------------------------------------------------ |
| 1    | Generate Action List for Login                    | http://localhost:3000/api/generate_actionlist/login          |
| 2    | Generate Action List for Converting to Order Page | http://localhost:3000/api/generate_actionlist/manager/orders |
| 3    | Generate Action List for Searching Order          | http://localhost:3000/api/generate_actionlist/manager/orders/search |
| 4    | Generate Action List for Downloading Order        | http://localhost:3000/api/generate_actionlist/manager/orders/download |



### 1)  Generate Action List for Login

### API 설명
이 API는 로그인 워크플로우의 액션 리스트를 생성합니다.

---

### 요청 (Request)

#### 요청 메서드 (HTTP Method)
- `POST`

#### 요청 URL
- `http://localhost:3000/api/generate_actionlist/login`

#### 요청 헤더 (Request Headers)
| 필드명         | 필수 | 설명                                |
| -------------- | ---- | ----------------------------------- |
| `Content-Type` | 예   | `text/html` 형식의 HTML 코드 스니펫 |

#### 요청 바디 (Request Body)
- **형식**: `text/html`
- **설명**: HTML 코드 스니펫이 텍스트 형식으로 포함됩니다.

#### 예시 요청 바디
```html
<div class="loginArea">
    <h1>
        <img src="/asset/images/manager/default/login_logo.png" alt="LOTTE HOTELS &amp; RESORTS MANAGEMENT SYSTEM">
    </h1>

    <form action="https://www.biteme.co.kr/manager/member/auth/login_check" id="postFrm" onkeydown="javascript:onEnterLogin();" method="post" accept-charset="utf-8">
        <input type="hidden" name="witplus_csrf_token" value="be5debdf9ac6a8c9e6c0a3b25836df0f">
        <input type="hidden" name="sms_security_num" size="" value="" title="" id="sms_security_num">
        <input type="hidden" name="resend_sms" size="" value="" title="" id="resend_sms">

        <ul class="login_input">
            <li class="user_id">
                <input type="text" id="m_id" name="m_id" placeholder="관리자 아이디" value="">
                <!-- <label class="label_id" for="m_id">Member ID</label> -->
            </li>
            <li class="user_pw">
                <input type="password" id="m_pw" name="m_pw" placeholder="비밀번호">
                <!-- <label class="label_pw" for="m_pw">Password</label> -->
            </li>
        </ul>
        
        <button type="button" value="LOGIN" id="loginBtn" name="loginBtn" class="loginBtn">로그인</button>

        <div class="saveId">
            <input type="checkbox" name="save_id_yn" id="save_id_yn" value="on"> 
            <label for="save_id_yn">
                <span>아이디 저장</span>
            </label>
        </div>
        
        <!-- <div class="btn_area">
            <button type="button" class="btn_under" id="layer_id_btn">시연아이디요청</button>
        </div> -->
    </form>
</div>
```

---

### 응답 (Response)

#### 응답 헤더 (Response Headers)
| 필드명         | 설명               |
| -------------- | ------------------ |
| `Content-Type` | `application/json` |

#### 응답 바디 (Response Body)
- **형식**: `application/json`

##### 예시 응답 바디
```json
{
    "actionList": [
        {
            "action": "navigate_to_url",
            "params": {
                "by": "https://www.biteme.co.kr/manager/login"
            }
        },
        {
            "action": "wait_for_element",
            "params": {
                "by": "id",
                "value": "m_id",
                "timeout": "10"
            }
        },
        {
            "action": "input_text",
            "params": {
                "by": "id",
                "value": "m_id",
                "text": "your_user_id"
            }
        },
        {
            "action": "input_text",
            "params": {
                "by": "id",
                "value": "m_pw",
                "text": "your_password"
            }
        },
        {
            "action": "click_element",
            "params": {
                "by": "id",
                "value": "loginBtn"
            }
        },
        {
            "action": "handle_alert",
            "params": {
                "by": "accept",
                "timeout": "10"
            }
        }
    ]
}
```

---



### 2) Generate Action List for Converting to Order Page

### API 설명

이 API는 매니저 페이지에서 주문 페이지로 이동하는 워크플로우의 액션 리스트를 생성합니다.

---

### 요청 (Request)

#### 요청 메서드 (HTTP Method)

- `POST`

#### 요청 URL

- `http://localhost:3000/api/generate_actionlist/manager/orders`

#### 요청 헤더 (Request Headers)

| 필드명         | 필수 | 설명                                |
| -------------- | ---- | ----------------------------------- |
| `Content-Type` | 예   | `text/html` 형식의 HTML 코드 스니펫 |

#### 요청 바디 (Request Body)

- **형식**: `text/html`
- **설명**: HTML 코드 스니펫이 텍스트 형식으로 포함됩니다.

#### 예시 요청 바디

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Admin Page</title>
</head>
<body>
    <!-- Main menu bar -->
    <nav id="gnb">
        <ul>
            <li><a href="/dashboard">Dashboard</a></li>
            <li><a href="/manager/order">Order Management</a></li> <!-- XPath: //*[@id='gnb']/li[2]/a -->
            <li><a href="/manager/products">Product Management</a></li>
        </ul>
    </nav>

    <!-- Content section -->
    <div id="content">
        <h1>Welcome to the Admin Page</h1>
        <p>Use the menu to navigate to different sections of the site.</p>
    </div>
</body>
</html>

```

---

### 응답 (Response)

#### 응답 헤더 (Response Headers)

| 필드명         | 설명               |
| -------------- | ------------------ |
| `Content-Type` | `application/json` |

#### 응답 바디 (Response Body)

- **형식**: `application/json`

##### 예시 응답 바디

```json
{
    "actionList": [
        {
            "action": "wait_for_element",
            "params": {
                "by": "id",
                "value": "gnb",
                "timeout": "10"
            }
        },
        {
            "action": "navigate_to_url",
            "params": {
                "by": "https://www.example.com/admin",
                "timeout": "15"
            }
        },
        {
            "action": "click_element",
            "params": {
                "by": "xpath",
                "\"//*[@id": "gnb']/ul/li[2]/a"
            }
        }
    ]
}
```

---



### 3) Generate Action List for Searching Order  

### API 설명

이 API는 주문 페이지에서 검색을 통해 결과를 확인하는  워크플로우의 액션 리스트를 생성합니다.

---

### 요청 (Request)

#### 요청 메서드 (HTTP Method)

- `POST`

#### 요청 URL

- `http://localhost:3000/api/generate_actionlist/manager/orders/search`

#### 요청 헤더 (Request Headers)

| 필드명         | 필수 | 설명                                |
| -------------- | ---- | ----------------------------------- |
| `Content-Type` | 예   | `text/html` 형식의 HTML 코드 스니펫 |

#### 요청 바디 (Request Body)

- **형식**: `text/html`
- **설명**: HTML 코드 스니펫이 텍스트 형식으로 포함됩니다.

#### 예시 요청 바디

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Order Management</title>
</head>
<body>
    <!-- Order management form -->
    <form id="orderForm" action="/manager/order/search" method="post">
        <table>
            <tr>
                <td>
                    <label for="order_state_cd_20">
                        <input type="checkbox" id="order_state_cd_20" name="order_state_cd" value="20"> Order State 20
                    </label>
                </td>
                <td>
                    <label for="order_state_cd_30">
                        <input type="checkbox" id="order_state_cd_30" name="order_state_cd" value="30"> Order State 30
                    </label>
                </td>
            </tr>
        </table>
        <button type="submit" class="btn_txt btn_black" onclick="shSubmit();">Search Orders</button>
    </form>

    <!-- JavaScript to simulate form submission -->
    <script>
        function shSubmit() {
            document.getElementById('orderForm').submit();
        }
    </script>
</body>
</html>

```

---

### 응답 (Response)

#### 응답 헤더 (Response Headers)

| 필드명         | 설명               |
| -------------- | ------------------ |
| `Content-Type` | `application/json` |

#### 응답 바디 (Response Body)

- **형식**: `application/json`

##### 예시 응답 바디

```json
{
    "actionList": [
        {
            "action": "navigate_to_url",
            "params": {
                "by": "https://www.biteme.co.kr/manager/order/order_product/order_product_list",
                "timeout": "15"
            }
        },
        {
            "action": "wait_for_element",
            "params": {
                "by": "css",
                "value": "input#order_state_cd_20",
                "timeout": "10"
            }
        },
        {
            "action": "click_element",
            "params": {
                "by": "css",
                "value": "input#order_state_cd_20"
            }
        },
        {
            "action": "click_element",
            "params": {
                "by": "css",
                "value": "input#order_state_cd_30"
            }
        }
    ]
}
```

---



### 4) Generate Action List for Downloading Order 

### API 설명

이 API는 주문 페이지에서 검색을 통해 결과를 확인하는  워크플로우의 액션 리스트를 생성합니다.

---

### 요청 (Request)

#### 요청 메서드 (HTTP Method)

- `POST`

#### 요청 URL

- `http://localhost:3000/api/generate_actionlist/manager/orders/download`

#### 요청 헤더 (Request Headers)

| 필드명         | 필수 | 설명                                |
| -------------- | ---- | ----------------------------------- |
| `Content-Type` | 예   | `text/html` 형식의 HTML 코드 스니펫 |

#### 요청 바디 (Request Body)

- **형식**: `text/html`
- **설명**: HTML 코드 스니펫이 텍스트 형식으로 포함됩니다.

#### 예시 요청 바디

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Order Management - Download</title>
</head>
<body>
    <!-- Order table -->
    <div class="write_table">
        <table>
            <thead>
                <tr>
                    <th>Order ID</th>
                    <th>Product</th>
                    <th>Status</th>
                    <th>Date</th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td>12345</td>
                    <td>Product A</td>
                    <td>Shipped</td>
                    <td>2023-09-27</td>
                </tr>
                <!-- More rows as needed -->
            </tbody>
        </table>
    </div>

    <!-- Excel download button -->
    <button class="btn_txt btn_exel" onclick="downExcelFn('order_state35');">Download Excel</button>

    <!-- JavaScript to handle Excel download -->
    <script>
        function downExcelFn(orderState) {
            // Simulate file download action
            console.log(`Downloading Excel file for order state ${orderState}`);
        }
    </script>
</body>
</html>
```

---

### 응답 (Response)

#### 응답 헤더 (Response Headers)

| 필드명         | 설명               |
| -------------- | ------------------ |
| `Content-Type` | `application/json` |

#### 응답 바디 (Response Body)

- **형식**: `application/json`

##### 예시 응답 바디

```json
{
    "actionList": [
        {
            "action": "wait_for_element",
            "params": {
                "by": "class",
                "value": "write_table",
                "timeout": "10"
            }
        },
        {
            "action": "monitor_file_downloads",
            "params": {
                "\"download_dir": "/path_to_download_directory'",
                "timeout": "300",
                "poll_interval": "2"
            }
        }
    ]
}
```

---

## 5. 동작 방식

![](https://codetutorbot.blob.core.windows.net/image/102.png)

#### 순서 1. 

(클라이언트 => 서버) 분석하고 싶은 워크플로우에 해당하는 HTML 코드 스니펫을 서버에 전송, Action List 요청



#### 순서 2.

(서버 => GPT) HTML 코드와 Agent Params와 Prompt를 묶어 GPT-4 API로 전송

- Agent Params: GPT-4에 요청하기 위한 프롬프트 파라미터 들이 포함

  

- 여기서, AWM 논문을 작성한 작성자가 공개한 소스코드를 분석하여, 프롬프트를 구성하였음. 프롬프트는 Instruction prompt와 각 워크플로우에 적합한 one-shot 학습을 위한 one-shot prompt로 구성되어 있음.

  - Instruction prompt: 에이전트의 역할, ohe-shot prompt의 워크 플로우(시나리오)를 분석하여, 제공한 예시대로 응답할 것, 최종적으로 나와야하는 응답 결과에 대한 설명, 요구(제약)사항 등이 포함되어 있음. 그리고 이 Instruction은 모든 워크 플로우에 공통으로 사용하는 프롬프트임.

    ```tex
    // Instruction.txt
    
    Your Role: Workflow Maker
    
    Your Task: Given an HTML code snippet, your task is to analyze the HTML and extract the necessary actions based on Concrete Example and Summary Workflows.
    
    Your Objective: Following Concrete Example and Summary Workflows, respond with a series of <think></think> and <action></action> pairs. Each <think></think> should describe the reasoning for the action that follows, and each <action></action> should be presented in function form, as shown in the example. Make sure to include both <think></think> and <action></action> for every step in the workflow.
    
    Additionally, ensure that non-fixed elements (like input text and button strings) are represented with descriptive variable names, as in the example.
    
    Requirement: Provide only the workflow without any explanation or additional text. If a step is optional or dependent on conditions (e.g., a captcha), mark it accordingly in the reasoning section of <think></think>.
    ```

    

  - one-shot prompt: 클라이언트가 선택한 API에 따라 에이전트가 학습할 수 있는 'Concere Example'과 'Summary Workflow'가 포함되어 있다. 여기서 Concrete Example은 해당 워크플로우에서 해결해야하는 큰 주제이고, Summary Workflow는 Concrete Example을 통해 Action List를 뽑아내기 위해 한번더 정제된 예시이다. 두 예시 모두 `<think>`와 `<action>` 태그에 단계별로 추론한 이유와 추론한 결과를 이행하기 위한 액션이 태그 사이에 담긴다.

    ```tex
    // one-host.txt
    
    ## Concrete Examples
    
    Query: Enter the user ID and password, then click the login button to log in.
    Acitions:
    <think>
    I need to access the login page first to start the process. I will navigate to the URL of the admin login page. 
    </think>
    <action> 
    navigate_to_url("https://www.biteme.co.kr/manager/login")
    </action> 
    
    ...
    
    ## Summary Workflows
    
    Workflow: Login on the first screen
    <think>
    I need to access the login page first to start the process. I will navigate to the URL of the admin login page. 
    </think>
    <action> 
    navigate_to_url("https://www.biteme.co.kr/manager/login")
    </action> 
    ```



#### 순서 3.

(GPT => 서버) 서버에서 전송한 HTML과 프롬프트를 통해, 학습하여 Completion으로 응답한다. 그리고 서버에서, `<action>`태그 사이에 생성된 함수 형태의 action을 Json 형태로 파싱처리한다.

```tex
// Json 형태로 처리하기 전, Login Workflow's Competion

<think>
I need to access the login page first to start the process. I will navigate to the URL of the admin login page.
</think>
<action>
navigate_to_url("https://www.biteme.co.kr/manager/login")
</action>

...
```

```json
// Json 형태로 처리 후

{
    "actionList": [
        {
            "action": "navigate_to_url",
            "params": {
                "by": "https://www.biteme.co.kr/manager/login"
            }
        },
    ...
}
```



#### 마지막

(서버 => 클라이언트) 서버에서 Json 형태로 파싱한 데이터를 전달

----

## 6. 프로젝트 개발 과정

AWM에 대한 자료가 부족해서, 해당 논문을 검색하여 연구하였음. Memorizing 하고 적절한 워크플로우를 랜덤 픽하는 기능은 연구가 필요하기에 개발할 수 없었음. AWM 논문에서 제공한 코드를 참고하여, 프롬프트 엔지니어링을 최대한 AWM 방식으로 구현하는데 집중하였음.

개발은 FastAPI와 SQL을 염두하고 개발하고 싶었지만, 과제 기간 내에 핵심적인 기능을 구현하기 위해 평소 사용하는 Next.js와 Typescript와 파일 저장 기반으로 개발하여 구현했음.

Example 1은 거의 근접해서 구현했지만, Example 2와 같은 셀레늄이 통하지 않을때 액션 리스트를 뽑아내는 기능은 구현할 수 없어 아쉬웠습니다.

----

## 마무리하며...

AWM 이라는 신 기술과 Robert 유튜버의 영상이 매우 흥미로웠습니다. 조금더 구현을 해보고 싶었지만 AWM이 생각외로 고려해야할 파이프라인 단계가 많아 아쉬웠습니다.

참고한 논문:

https://arxiv.org/abs/2409.07429
