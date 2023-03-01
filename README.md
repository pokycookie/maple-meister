# [Maple Meister](https://pokycookie.github.io/maple-meister/)

## TODO LIST

- [ ] 데이터베이스 값 수정
- [ ] 데이터베이스 값 삭제

### Chart Page

#### 날짜별 데이터 정리

- [ ] `daily`
- [ ] `weekly`
- [ ] `monthly`

### Setting Page

#### MMDF Reader

##### backup

- [ ] default: 기존의 모든 내용을 삭제하고 파일의 내용대로 데이터들을 새로 생성
- [ ] option1: 기존의 데이터를 모두 유지한 상태로 새롭게 데이터들을 생성
- [ ] option2: 기존의 모든 내용을 삭제하고 파일의 내용대로 데이터들을 새로 생성

##### recipe

- [x] default: 같은 이름의 레시피가 없다면 파일의 내용대로 레시피를 새로 생성
- [x] default: 같은 이름의 레시피가 이미 있다면 건드리지 않음
- [x] option1: 같은 이름의 레시피의 `items` `name` `resultCount` `resultItem`을 업데이트
- [ ] option2: 기존의 모든 내용을 삭제하고 파일의 내용대로 레시피를 새로 생성

##### item

- [x] default: 같은 이름의 아이템이 없다면 파일의 내용대로 아이템을 새로 생성
- [x] default: 같은 이름의 아이템의 `price`를 업데이트
- [x] option1: 같은 이름의 아이템이 이미 있다면 건드리지 않음
- [ ] option2: 기존의 모든 내용을 삭제하고 파일의 내용대로 아이템을 새로 생성

##### itemLog

- [ ] default: 파일의 내용대로 아이템 로그를 새로 생성
- [ ] default: 같은 시간대의 로그는 무시함
- [ ] option1: 같은 시간대의 로그는 덮어씀
- [ ] option2: 기존의 모든 내용을 삭제하고 파일의 내용대로 로그를 새로 생성

##### ledger

- [ ] default: 파일의 내용대로 거래 장부를 새로 생성
- [ ] option1: `assets`을 0으로 통일하여 거래 장부를 생성
- [ ] option2: 기존의 모든 내용을 삭제하고 파일의 내용대로 거래 장부를 새로 생성
