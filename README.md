# [Maple Meister](https://pokycookie.github.io/maple-meister/)

![React](https://img.shields.io/badge/React-61DAFB?style=for-the-badge&logo=React&logoColor=black)
![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=TypeScript&logoColor=white)
![Redux](https://img.shields.io/badge/Redux-764ABC?style=for-the-badge&logo=Redux&logoColor=white)
![PWA](https://img.shields.io/badge/PWA-5A0FC8?style=for-the-badge&logo=PWA&logoColor=white)
![Dexie](https://img.shields.io/badge/Dexie-272822?style=for-the-badge&logo=Dexie&logoColor=white)

## 소개

Maple Meister는 Nexon의 온라인 RPG게임 메이플스토리의 전문기술 컨텐츠를 더욱 체계적으로 즐길 수 있도록 도와주기 위한 웹 어플리케이션 입니다. 해당 어플리케이션은 메이플스토리 게임 프로그램에 직접적으로 관여하지 않으며, 단순히 보조적인 역할만을 수행한다는 것을 밝힙니다.

Maple Mesiter는 다음과 같은 기능을 제공합니다.

- 제작 쿨타임이 완료되는 시간을 알려주는 반복 타이머
- 아이템의 현재 시세를 기록할 수 있는 페이지
- 아이템의 거래 기록을 기록할 수 있는 페이지
- 시간에 따른 아이템의 시세를 차트로 확인
- 작성된 레시피를 토대로 재료 아이템과 결과 아이템의 시세를 비교하여 순수익을 차트로 확인

## 사용법

### **페이지 이동**

Maple Meister는 여러 개의 페이지를 가지고 있습니다.

사이드바에 있는 각 메뉴를 클릭하여 해당하는 페이지로 이동할 수 있으며, 가장 위쪽의 버튼을 눌러 사이드바를 확장시키거나 닫을 수 있습니다.

![메뉴이동](https://github.com/pokycookie/maple-meister/assets/58474094/5a07752d-23b7-478b-88ce-95e5c4b0d882)

### **타이머 페이지**

Maple Meister에 내장된 타이머는 무한히 반복하는 반복 타이머입니다. 최소 1초부터 최대 23시간 59분 59초까지 시간을 설정할 수 있으며, 설정된 시간이 지나게 되면 다시 처음 설정된 시간으로 돌아가 타이머 기능을 계속 반복합니다.

![타이머설정](https://github.com/pokycookie/maple-meister/assets/58474094/66fb5620-a2aa-4df0-a807-8dadba152201)

타이머가 작동중일때 PAUSE버튼을 눌러 일시정지를 할 수 있고, STOP버튼을 눌러 타이머를 완전히 정지시키고 원래 상태로 되돌릴 수 있습니다.

![타이머작동](https://github.com/pokycookie/maple-meister/assets/58474094/88212af1-515b-4193-9e65-bc0cd185dab6)

자주 사용하는 타이머 시간은 저장해두었다가 다음에 즉시 설정할 수 있습니다. 타이머 페이지의 우측 하단 버튼 두 개를 이용해 현재 타이머 시간을 저장하거나, 저장된 타이머 시간을 바로 적용할 수 있습니다.

![타이머프리셋](https://github.com/pokycookie/maple-meister/assets/58474094/11a95e59-3952-4831-9c8c-a9f4027335b6)

### **차트 페이지**

차트 페이지에서는 아이템의 시세 변화를 차트로 확인할 수 있습니다. 좌측 상단의 옵션창을 이용해서 시세를 확인할 아이템을 설정할 수 있고, 우측 상단의 옵션창을 이용해서 시세를 확인할 기간을 정할 수 있습니다.

기간 옵션은 `daily` `weekly` `monthly`로 나뉘며, 각각 하루 단위, 일주일 단위, 한 달 단위로 기간을 설정할 수 있습니다. `daily`옵션일 경우에는 하루의 모든 데이터를 차트로 보여주며, `weekly` `monthly`옵션일 경우에는 하루 단위로 데이터를 모아 평균을 낸 다음 차트로 표시합니다.

![차트](https://github.com/pokycookie/maple-meister/assets/58474094/93867205-beec-4bb6-81dd-fbedd0ddcadc)

### **레시피 페이지**

레시피 페이지에서는 제작 레시피 중 어떤 레시피가 가장 높은 순이익을 만들어 낼 수 있는지를 파이 차트의 형태로 보여줍니다. 해당 차트는 가장 최근의 아이템 시세를 기준으로 만들어집니다.

![레시피확인](https://github.com/pokycookie/maple-meister/assets/58474094/552fbc08-1ee1-4b1a-bcf0-ab5e0303338f)

이때 사용할 레시피는 해당 페이지 우측 하단의 첫 번째 버튼을 이용해서 새롭게 추가하거나 삭제할 수 있습니다. 레시피를 추가할때는 결과 아이템과 재료 아이템을 선택하고, 각 아이템의 개수를 정할 수 있습니다. 이때 재료 아이템의 경우 필요한 재료의 종류만큼 여러 번 추가할 수 있으며, 잘못된 아이템을 재료로 추가했거나 필요한 재료 개수를 잘못 설정했을 경우 재료 리스트에서 클릭해서 삭제할 수 있습니다. 레시피의 이름은 기본적으로 결과 아이템의 이름에 '제작 레시피'가 붙은 형태로 설정됩니다. 필요하다면 원하는 이름으로 수정할 수 있습니다.

![레시피추가](https://github.com/pokycookie/maple-meister/assets/58474094/9c5bb1ad-4497-4135-ad14-e8b8f613c1ef)

각 파이 차트를 클릭하면 해당 레시피의 결과 아이템과 재료 아이템 목록들을 확인할 수 있고, 동시에 해당 아이템들의 가장 최근 시세를 확인할 수 있습니다. 각 아이템을 클릭하면 해당 아이템의 가격을 새로운 값으로 업데이트 할 수 있습니다. 이때 업데이트 된 아이템의 가격은 실제 데이터베이스에 반영됩니다.

![레시피아이템업데이트](https://github.com/pokycookie/maple-meister/assets/58474094/d386698e-0acc-492f-bd5c-049b3e1eeb67)

만약 데이터베이스의 아이템 가격을 최신 값으로 업데이트 하고 싶지는 않지만, 아이템 가격이 변동됨에 따라 달라지는 레시피의 효율을 서로 비교하고 싶다면, 레시피 페이지의 아래 숨겨진 창을 열어 임시적으로 아이템 가격을 변경할 수 있습니다. 해당 기능을 이용하여 변경한 아이템 가격은 레시피 페이지에서만 임시적으로 적용되며, 다른 페이지의 아이템 가격에는 영향을 끼치지 않습니다.

![레시피시뮬레이션](https://github.com/pokycookie/maple-meister/assets/58474094/07d042a6-c1d4-4751-be54-59bdab606cf6)

기존에 작성했던 레시피를 수정하거나 완전히 삭제하고 싶다면, 우측 하단의 두 번째 버튼을 눌러 수정 또는 삭제할 수 있습니다. 레시피 리스트의 좌측을 누르면 수정, 우측을 누르면 삭제를 할 수 있습니다.

![레시피수정](https://github.com/pokycookie/maple-meister/assets/58474094/42d0f01e-6735-4f02-be36-fcfc9e89afeb)

![레시피삭제](https://github.com/pokycookie/maple-meister/assets/58474094/dd218859-9787-4a7f-be0a-b9dc9fb146e2)

### **거래 페이지**

거래 페이지에서는 아이템을 사고 판 기록을 저장합니다. 거래한 아이템의 종류를 정하고 얼마에 거래했는지, 몇 개를 거래했는지를 적고, 판매 또는 구입버튼을 눌러 거래를 기록합니다. 이때 거래의 종류가 판매이든 구입이든 간에 거래가 기록된다면, 자동으로 해당 거래 가격으로 거래 아이템의 최신 시세를 업데이트 합니다.

![거래생성](https://github.com/pokycookie/maple-meister/assets/58474094/536ae3a1-8124-4f92-a41e-0d3a3e3580f5)

지금까지의 거래 내역을 확인하고 싶다면, 거래 페이지의 우측 하단 버튼을 눌러 확인할 수 있습니다. 만약 실수로 잘못된 거래를 생성한 경우, 해당 거래 내역 리스트에서 삭제하고 싶은 거래의 우측을 눌러 삭제할 수 있습니다.

![거래기록확인](https://github.com/pokycookie/maple-meister/assets/58474094/00683517-4cc4-4766-ae2b-2c300a78169c)

### **아이템 페이지**

아이템 페이지에서는 새로운 아이템을 추가하거나, 기존의 아이템의 가격을 업데이트 할 수 있습니다.

![아이템업데이트](https://github.com/pokycookie/maple-meister/assets/58474094/e15ea6d1-cebe-4d0d-901e-a713c84b42a0)

우측 하단 버튼들을 이용해서 새로운 아이템을 추가하거나, 아이템 가격의 변화 내역을 확인할 수 있습니다.

![아이템추가삭제](https://github.com/pokycookie/maple-meister/assets/58474094/5d10228c-bde2-4309-a1d7-582ce6a5cb81)

![아이템기록](https://github.com/pokycookie/maple-meister/assets/58474094/185d5d5e-db23-429f-9304-bab9fc5db31e)

아이템 페이지는 아이템의 가격을 업데이트 할 수 있는 공간이지만, 그렇다고 아이템 가격을 업데이트 할 수 있는 유일한 공간은 아닙니다. 레시피 페이지에서 특정 레시피를 클릭해 해당 레시피에 사용되는 아이템의 가격을 업데이트 할 수 있으며, 거래 페이지에서 구입 또는 판매를 통해서도 사용된 아이템의 가격을 업데이트 할 수 있습니다.

또한 아이템 가격의 변화 내역 역시 차트 페이지를 이용하면 차트를 통해 더욱 간편하게 확인할 수 있습니다. 따라서 새로운 아이템을 생성하거나, 거래를 하지 않았으며 레시피와도 관련이 없는 아이템의 가격을 업데이트 하기 위해서만 해당 페이지를 사용할 가능성이 높습니다.

## 기술 스택

![React](https://img.shields.io/badge/React-61DAFB?style=for-the-badge&logo=React&logoColor=black)
![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=TypeScript&logoColor=white)
![Redux](https://img.shields.io/badge/Redux-764ABC?style=for-the-badge&logo=Redux&logoColor=white)
![PWA](https://img.shields.io/badge/PWA-5A0FC8?style=for-the-badge&logo=PWA&logoColor=white)
![Dexie](https://img.shields.io/badge/Dexie-272822?style=for-the-badge&logo=Dexie&logoColor=white)

## 🎯 TODO LIST (v1.1.0 ~ v1.4.0)

- [x] 아이템 페이지: 아이템 삭제 기능 추가
- [x] 아이템 페이지: 아이템 업데이트 기록 삭제 기능 추가
- [x] 거래 페이지: 거래 기록 삭제 기능 추가
- [x] 레시피 페이지: 레시피 수정 기능 추가
- [x] 차트 페이지: 기간 옵션 default값을 monthly로 수정
- [x] 차트 페이지: 기간 옵션 변경시 month가 변하는 문제 수정
- [x] 차트 페이지: 옵션의 가장 처음 값을 default value로 제공
- [ ] 차트 페이지: nivo차트 대신 직접 제작한 차트를 사용하도록 수정
- [ ] 타이머 페이지: 여러 개의 타이머를 동시에 사용할 수 있는 기능 추가
- [x] 메뉴 확장 기능 추가
- [ ] 애플리케이션에 기본 데이터 내장 (기본 아이템 + 기본 레시피)
- [ ] item, recipe의 key값으로 해당 아이템과 레시피의 이름을 사용하도록 변경
- [ ] 대시보드 추가
- [ ] 숫자 입력을 위한 input 보완
- [ ] 즐겨찾기 기능 추가
- [ ] 잔액 삭제
- [ ] 새로운 거래 페이지 추가 (판매 예정 기능)
- [ ] 데이터 삭제를 포함한 위험한 작업 전 확인 모달창 추가
- [x] 달력의 맨 위 버튼을 누를 시 현재 날짜로 자동 변경 및 이동
