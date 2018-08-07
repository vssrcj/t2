import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import Search from 'components/Search';
import { parseUrlParams, stringifyUrlParams, map, some } from 'utils';
import {
   Table as TableStyle, Header, HeaderName, HeaderTotal, TableHeaderContent,
   Footer, PagingText, PagingButton, PagingButtonContainer,
} from './styles';

function parseData({ columns, data, id }) {
   const parsedData = map(data, d => ({
      key: d[id],
      columns: columns.reduce((res, column) => {
         const value = column.render ? column.render(d[column.key]) : d[column.key];

         const sorter = column.type === Number ? value : (value || '').toLowerCase();

         const searcher = column.type === Number ? value.toString() : sorter;

         return {
            ...res,
            [column.key]: {
               value,
               sorter,
               searcher,
            },
         };
      }, {}),
   }));

   return parsedData;
}

function filterData(data, filter) {
   if (!filter) return data;
   return data.filter(d => (
      some(d.columns, ({ searcher }) => searcher.indexOf(filter) > -1)
   ));
}

function sortData(data, sort, asc) {
   if (!sort) return data;
   return data.sort((a, b) => {
      const aVal = a.columns[sort].sorter;
      const bVal = b.columns[sort].sorter;
      if (aVal > bVal) return asc ? 1 : -1;
      if (bVal > aVal) return asc ? -1 : 1;
      return 0;
   });
}

class Table extends Component {
   constructor(props) {
      super(props);
      this.state = {
         data: parseData({
            columns: props.columns,
            id: props.id,
            data: props.data,
         }),
      };
      this.hash = {};
   }

   componentWillReceiveProps(props) {
      if (props.location.search === this.props.location.search) {
         this.setState({ data: parseData(props) });
      }
   }

   pushParams = (newParams, params) => {
      this.props.history.push({ search: stringifyUrlParams(newParams, params) });
   }

   handleHeadingClick = (key, params) => () => {
      this.pushParams({
         sort: key,
         asc: (key === params.sort ? !params.asc : true),
      }, params);
   };

   handleFilter = params => ({ target: { value } }) => {
      this.pushParams({
         filter: value,
         page: 0,
      }, params);
   }

   handlePrev = (page, params) => () => {
      this.pushParams({
         page: page - 1,
      }, params);
   }

   handleNext = (page, params) => () => {
      this.pushParams({
         page: page + 1,
      }, params);
   }

   render() {
      const {
         columns, location: { search }, pageLength, name,
      } = this.props;

      const params = parseUrlParams(search);
      // Make sure sort parameter actually exist in the data.
      const sort = columns.some(c => c.key === params.sort) && params.sort;
      const page = params.page ? Number.parseInt(params.page, 10) : 0;
      const { asc = false, filter = '' } = params;

      const { data } = this.state;

      const filtered = filterData(data, filter);

      const sorted = sortData(filtered, sort, asc)
         .slice(page * pageLength, (page * pageLength) + pageLength);

      function getLeft() {
         return (page * pageLength) + 1;
      }
      function getRight() {
         const max = (page * pageLength) + pageLength;
         return max > filtered.length ? filtered.length : max;
      }

      return (
         <div>
            <Header>
               <HeaderName>{name}</HeaderName>
               <HeaderTotal>({filtered.length} found)</HeaderTotal>
               <Search placeholder="Filter..." value={filter} onChange={this.handleFilter(params)} />
            </Header>
            <TableStyle>
               <thead>
                  <tr>
                     {columns.map((column) => {
                        const active = sort === column.key;

                        return (
                           <th key={column.key}>
                              <TableHeaderContent active={active}>
                                 {column.name}
                                 {/* eslint-disable-next-line */}
                                 <i className="material-icons" onClick={this.handleHeadingClick(column.key, params)}>
                                    {(asc || !active) ? 'arrow_drop_up' : 'arrow_drop_down'}
                                 </i>
                              </TableHeaderContent>
                           </th>
                        );
                     })}
                  </tr>
               </thead>
               <tbody>
                  {sorted.map(d => (
                     <tr key={d.key}>
                        {columns.map(column => (
                           <td key={column.key}>
                              {d.columns[column.key].value}
                           </td>
                        ))}
                     </tr>
                  ))}
               </tbody>
            </TableStyle>
            <Footer>
               <PagingText>
                  Showing {getLeft()} to {getRight()} entries
               </PagingText>
               <PagingButtonContainer>
                  {page > 0 &&
                     <PagingButton onClick={this.handlePrev(page, params)}>Previous</PagingButton>
                  }
                  {((page * pageLength) + pageLength) < filtered.length &&
                     <PagingButton onClick={this.handleNext(page, params)}>Next</PagingButton>
                  }
               </PagingButtonContainer>
            </Footer>
         </div>
      );
   }
}

Table.propTypes = {
   columns: PropTypes.arrayOf(PropTypes.shape()).isRequired,
   data: PropTypes.arrayOf(PropTypes.shape()).isRequired,
   id: PropTypes.string.isRequired,
   history: PropTypes.shape().isRequired,
   location: PropTypes.shape().isRequired,
   pageLength: PropTypes.number,
   name: PropTypes.string.isRequired,
};

Table.defaultProps = {
   pageLength: 10,
};

export default withRouter(Table);
