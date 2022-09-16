import styled from 'vue-styled-components'

export const StyledTable = styled.table`
  caption-side: top;
  border: none;
  border-collapse: collapse;
  margin: 0px auto;
  /* border-collapse: separate; */
  /* border-spacing: 5px 10px; */

  caption-side: bottom;
  /* empty-cell: show | hide;  */
  /* empty-cell is a property of table or the cells themselves */

  /* vertical-align: baseline | sub | super | text-top | 
              text-bottom | middle | top | bottom | 
              <percentage> | <length> */

  /* tbody {
  vertical-align: top;
}              */
  td,
  th {
    border: none;
    margin-right: 30px;
  }
  /* td,
th {
  border: 1px solid;
  margin-right: 30px;
} */

  td {
    padding: 5px 10px;
    text-align: right;
  }

  tbody tr {
    // :nth-of-type(odd) {
    //   background-color: #efefef;
    // }
    :hover {
      background-color: black;
    }
  }
  thead > tr {
    background-color: #c2c2c2;
    text-align: right;
    color: color: rgb(195, 197, 203);
  }
  caption {
    font-size: 0.9em;
    padding: 5px;
    font-weight: bold;
  }
`

export const TitleBox = styled.div`
  font-size: 18px;
  -webkit-font-smoothing: antialiased;
  -webkit-tap-highlight-color: rgba(0, 0, 0, 0);
  font-feature-settings: 'ss01', 'ss02', 'cv01', 'cv03';
  font-variant: no-common-ligatures no-discretionary-ligatures
    no-historical-ligatures no-contextual;
  height: 50px;
  display: flex;
  justify-content: right;
  align-items: center;
  min-width: 180px;
  background-color: rgb(25, 27, 31);
  padding-right: 10px;
  color: rgb(195, 197, 203);
  font-weight: 700;
`

export const ContentBox = styled.div`
  font-size: 16px;
  -webkit-font-smoothing: antialiased;
  -webkit-tap-highlight-color: rgba(0, 0, 0, 0);
  font-feature-settings: 'ss01', 'ss02', 'cv01', 'cv03';
  font-variant: no-common-ligatures no-discretionary-ligatures
    no-historical-ligatures no-contextual;
  height: 50px;
  display: flex;
  justify-content: right;
  align-items: center;
  background-color: transparent;
  color: white;
  font-weight: 400;
`
