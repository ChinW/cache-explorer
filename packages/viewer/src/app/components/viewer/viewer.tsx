// import _ from 'lodash';
// import * as React from 'react';
// import { AgGridReact } from 'ag-grid-react';
// import 'ag-grid-enterprise';
// import { GridReadyEvent, ColumnApi, GridApi } from 'ag-grid-community';
// import { SearchBar } from '../searchbar/searchBar';
// import { WsResponseType } from 'shared/src/enums';
// import { Ws } from '../../lib/websocket';
// import { extractColumns, getSearch } from '../../lib/utils';
// import { Order } from 'shared/src/types/order';
// import { useLocation } from 'react-router';

// const initialState: WsExplorer.Props = {
//   request: undefined,
//   response: undefined,
//   // data: [],
//   ws: new Ws()
// };

// export const wsDataReducer = (state: WsExplorer.Props, action: WSS.Response) => {
//   switch (action.type) {
//     case WsResponseType.DeltaData: {
//       return Object.assign({}, state, {
//         response: action,
//         // data: state.data.concat(action.data)
//       });
//     }
//     case WsResponseType.InitData: {
//       return Object.assign({}, state, {
//         response: action,
//         // data: action.data
//       });
//     }
//     default:
//       return state;
//   }
// };

// export const Viewer = (props: WsExplorer.Props) => {
//   const location = useLocation();
//   const query = getSearch(location.search);
//   const [gridColumns, setGridColumns] = React.useState<CacheGrid.Column[]>();
//   const [gridColumnApi, setGridColumnApi] = React.useState<ColumnApi>();
//   const [gridApi, setGridApi] = React.useState<GridApi>();
//   const [state, dispatch] = React.useReducer(wsDataReducer, initialState);

//   React.useEffect(() => {
//     const initWs = async () => {
//       await state.ws.init();
//       return new Promise((resolve) => {
//         state.ws.subscribeOnMessage((response: WSS.Response) => {
//           console.log("on response", response);
//           dispatch(response);
//           resolve(0);
//         });
//       });
//     };
//     initWs();
//     return () => {
//       state.ws.close();
//     };
//   }, [dispatch]);

//   React.useEffect(() => {
//     if (state.ws.socket && state.ws.socket.readyState === WebSocket.OPEN) {
//       state.ws.subscribeMap(query.map, query.filter);
//     }
//   }, [state.ws.socket, location]);

//   React.useEffect(() => {
//     if (state.response && gridColumnApi && gridApi) {
//       gridApi.applyTransaction(state.response.data);
//       if (state.response.type === WsResponseType.InitData) {
//         gridColumnApi.autoSizeAllColumns();
//       }
//       if(!gridColumns && state.response.data.add.length > 0) {
//         setGridColumns(extractColumns(_.get(state, 'response.data.add[0]', {})))
//       }
//     }
//   }, [state.response]);

//   const onGridReady = (params: GridReadyEvent) => {
//     setGridColumnApi(params.columnApi);
//     setGridApi(params.api);
//     params.columnApi.autoSizeAllColumns();
//   };

//   return (
//     <div className="flex flex-col w-full h-full">
//       <SearchBar query={query} />
//       <div className={`flex-grow ag-theme-alpine`}>
//         <AgGridReact
//           columnDefs={gridColumns}
//           defaultColDef={{
//             resizable: true,
//             sortable: true,
//             enablePivot: true,
//             enableRowGroup: true
//           }}
//           sideBar={true}
//           enableRangeSelection={true}
//           enableCellChangeFlash={true}
//           statusBar={{
//             statusPanels: [
//               {
//                 statusPanel: 'agTotalAndFilteredRowCountComponent',
//                 align: 'left'
//               },
//               {
//                 statusPanel: 'agTotalRowCountComponent',
//                 align: 'center'
//               },
//               { statusPanel: 'agFilteredRowCountComponent' },
//               { statusPanel: 'agSelectedRowCountComponent' },
//               { statusPanel: 'agAggregationComponent' }
//             ]
//           }}
//           rowGroupPanelShow={'always'}
//           pivotPanelShow={'always'}
//           pivotColumnGroupTotals={'after'}
//           pivotRowTotals={'before'}
//           // rowData={state.data}
//           onGridReady={onGridReady}
//           deltaRowDataMode={true}
//           getRowNodeId={(data: Order) => {
//             return data.id;
//           }}
//         />
//       </div>
//     </div>
//   );
// };
