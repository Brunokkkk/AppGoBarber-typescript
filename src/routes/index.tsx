import React from 'react';
import { View, ActivityIndicator} from 'react-native';
import AuthRoutes from './auth.routes';
import AppRoutes from './app.routes';

import { useAuth } from '../hooks/AuthContext'

const Routes: React.FC = () => {
  const { loading, user } = useAuth();

  if(loading){
    return (<View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}} >
      <ActivityIndicator size="large" color="666" />
    </View>)
  }

  return user ? <AuthRoutes/> : <AppRoutes/>
}

export default Routes;
