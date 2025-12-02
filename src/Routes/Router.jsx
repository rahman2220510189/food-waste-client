import { createBrowserRouter } from 'react-router-dom';
import { Main } from '../Layout/Main';
import { Home } from '../Pages/Home/Home';
import UploadForm from '../Pages/UploadForm';
import { BookOrOrderModel } from '../Pages/Pages/BookOrOrderModel';
import { Browse } from '../Pages/Browse/Browse';
import { LiveMap } from '../Other/LiveMap';
import LogIn from '../SignUpRelated/LogIn';
import SignUp from '../SignUpRelated/SignUp';
import Notifications from '../Related/Notifications';
import Messages from '../Related/Messages';
import History from '../Related/History';
import Dashboard from '../Related/Dashboard';
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
       {
         path:'login' ,
         element:<LogIn></LogIn> ,   
       },
       {
        path:'signup',
        element:<SignUp></SignUp>
       },
       {
        path:'/notifications',
        element:<Notifications></Notifications>,
       },
       {
        path:"/messages",
        element:<Messages></Messages>,
       },
     {
      path:'/history',
      element:<History></History>
     },
     {
      path:'/dashboard',
      element:<Dashboard></Dashboard>
     }
    ]
  },
]);
