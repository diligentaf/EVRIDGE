import styled from 'vue-styled-components'

export const Container = styled.div`
  width: 90%;
  max-width: 480px;
  height: 500px;
  border-radius: 24px;
  margin-top: 1rem;
  box-shadow: rgb(0 0 0 / 1%) 0px 0px 1px, rgb(0 0 0 / 4%) 0px 4px 8px,
    rgb(0 0 0 / 4%) 0px 16px 24px, rgb(0 0 0 / 1%) 0px 24px 32px;
  background: rgb(25, 27, 31);
  position: relative;
  padding: 20px;
  margin: 1rem auto;
`
export const TitleBox = styled.div`
  width: 90%;
  color: white;
  font-family: 'Inter custom', sans-serif;
  font-size: 16px;
  font-weight: 700;
  margin-bottom: 20px;
`

export const AddressInputBox = styled.div`
  width: 100%;
  height: 90px;
  display: flex;
  justify-content: space-between;
  border: 1px solid rgb(25, 27, 31);
  background-color: rgb(33, 36, 41);
  border-radius: 20px;
  margin-bottom: 10px;
`

export const AddressInput = styled.input`
  filter: none;
  opacity: 1;
  transition: opacity 0.2s ease-in-out 0s;
  text-align: left;
  color: rgb(255, 255, 255);
  width: 70%;
  position: relative;
  font-weight: 500;
  outline: none;
  border: none;
  flex: 1 1 auto;
  background-color: rgb(33, 36, 41);
  font-size: 22px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  padding: 16px;
  appearance: textfield;
  border-radius: 20px;
  // font-family: 'Inter custom',sans-serif;
`

export const CurrencyBox = styled.button`
  -webkit-box-align: center;
  align-items: center;
  // background-color: rgb(44, 47, 54);
  background-color: rgb(33, 114, 229);
  box-shadow: rgb(0 0 0 / 8%) 0px 6px 10px;
  color: rgb(255, 255, 255);
  cursor: pointer;
  border-radius: 16px;
  outline: none;
  user-select: none;
  border: none;
  font-size: 20px;
  font-weight: 500;
  height: 2.4rem;
  width: initial;
  padding: 0px 8px;
  -webkit-box-pack: justify;
  justify-content: space-between;
  margin-left: 12px;
  visibility: visible;
  margin: auto 16px;
`

export const SubmitButton = styled.button`
  background-color: rgba(21, 61, 111, 0.44);
  color: rgb(80, 144, 234);
  font-size: 16px;
  font-weight: 500;
  padding: 16px;
  width: 100%;
  font-weight: 500;
  text-align: center;
  border-radius: 20px;
  outline: none;
  border: 1px solid transparent;
  color: rgb(255, 255, 255);
  text-decoration: none;
  display: flex;
  -webkit-box-pack: center;
  justify-content: center;
  flex-wrap: nowrap;
  -webkit-box-align: center;
  align-items: center;
  cursor: pointer;
  position: relative;
  z-index: 1;
  will-change: transform;
  transition: transform 450ms ease 0s;
  transform: perspective(1px) translateZ(0px);
  margin-top: 10px;
`

// const SendBox = () => {
//   return (
//     <Container>
//       <TitleBox>Transfer Cosmos Token to Metamask</TitleBox>
//       <AddressInputBox>
//         <AddressInput placeholder="Your Keplr Address" />
//       </AddressInputBox>
//       <AddressInputBox>
//         <AddressInput placeholder="Send to (Metamask Address)" />
//       </AddressInputBox>
//       <AddressInputBox>
//         <AddressInput placeholder="0.0" />
//         <CurrencyBox>OSMO $</CurrencyBox>
//       </AddressInputBox>
//       <SubmitButton>Submit</SubmitButton>
//     </Container>
//   )
// }

// export default SendBox
