import styled from 'vue-styled-components'
import EvridgeLogo from '../../assets/Evridge_onlytext.svg'
import EvridgeImg from "../../assets/evridge_p.svg"

const StyledHeader = styled.h1`
  font-size: 34px;
  text-align: center;
  color: white;
  background-color: transparent;
  margin-left: 30px;
  margin-top: 10px;
`

const StyledHeaderImg = styled.img`
  height: 30px;
  margin-left: 10px;
`

const StyledHeaderLogo = styled.img`
  height: 30px;
`

const Header = () => {
  return <StyledHeader>
    <StyledHeaderLogo src={EvridgeImg}/>
    <StyledHeaderImg src={EvridgeLogo}/>
  </StyledHeader>
}

export default Header
