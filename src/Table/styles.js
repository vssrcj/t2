import styled, { css } from 'styled-components';

export const Table = styled.table`
   width: 100%;
   margin-top: 24px;
   thead {
      color: #323262;
      border-bottom: 1px solid #eee;
   }
   tbody {
      color: #928eab;
      font-weight: lighter;
   }
   th, td {
      padding: 20px 16px;
      text-align: left;
   }
   th {
      text-transform: uppercase;
   }
   tr {
      border-bottom: 1px solid #eee;
   }
`;

export const TableHeaderContent = styled.div`
   display: flex;
   align-items: center;
   i {
      ${props => (props.active ? css`
         visibility: visible;
      ` : css`
         visibility: hidden;
         color: #928eab;
      `)}
      border-radius: 50%;
      margin-left: 10px;
      cursor: pointer;
      &:hover {
         background-color: #eee;
      }
   }
   &:hover i {
      visibility: visible;
   }
`;

export const Header = styled.div`
   display: flex;
   align-items: baseline;
   padding-bottom: 30px;
   border-bottom: 1px solid #eee;
`;

export const HeaderName = styled.div`
   font-size: 20px;
   font-weight: bold;
`;

export const HeaderTotal = styled.div`
   color: #928eab;
   margin: 0 60px 0 20px;
`;

export const Search = styled.input`
   outline: none;
   padding: 8px;
   border: 1px solid #ddd;
   font: inherit;
   &:focus {
      border: 1px solid #928eab;
   }
   &::placeholder {
      color: #928eab;
   }
`;
export const Footer = styled.div`
   margin-top: 20px;
   display: flex;
   align-items: center;
   color: #323262;
`;
export const PagingText = styled.div`

`;
export const PagingButton = styled.button`
   background: #f1f1f1;
   outline: none;
   border: none;
   font: inherit;
   padding: 8px;
   color: inherit;
   margin: 0 6px;
   cursor: pointer;
   &:hover {
      background: #d9d9d9;
   }
`;
export const PagingButtonContainer = styled.div`
   margin-left: auto;
`;
