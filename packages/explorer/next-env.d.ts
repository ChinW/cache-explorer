/// <reference types="next" />
/// <reference types="next/types/global" />


declare global {
}

declare namespace CacheGrid {
    interface Column {
        headerName: string;
        field: string;
    }
}


// declare namespace WsExplorer {
//     interface Column {
//       headerName: string;
//       field: string;
//     }
  
//     interface Props {
//       request?: WSS.Request;
//       response?: WSS.Response;
//       data: Array<any>;
//     }
//   }
