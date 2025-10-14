import { createBrowserRouter } from 'react-router-dom';
import { Main } from '../Layout/Main';
import { Home } from '../Pages/Home/Home';
import UploadForm from '../Pages/UploadForm';
import { BookOrOrderModel } from '../Pages/Pages/BookOrOrderModel';
import { Browse } from '../Pages/Browse/Browse';
import { LiveMap } from '../Other/LiveMap';
export const router = createBrowserRouter([
  {
    path: '/',
    element:<Main></Main>,
    children:[
      {
        path:'/',
        element:<Home></Home>,
       },
       {
        path:'post',
        element:<UploadForm></UploadForm>
       },
       {
        path:'/order/:id',
        element:<BookOrOrderModel></BookOrOrderModel>
       },
       {
        path:'browse',
        element:<Browse></Browse>,
       },
     
    ]
  },
]);
