import React, { useRef, useCallback } from 'react';
import { Image, ScrollView, TextInput, Alert } from 'react-native';
import Icons from 'react-native-vector-icons/Feather'
import {useNavigation} from '@react-navigation/native'
import { Form } from '@unform/mobile';
import { FormHandles } from '@unform/core';
import * as Yup from 'yup';
import api from '../../services/api';

import getValidationErrors from '../../utils/getValidationErrors';

import Input from '../../components/Input';
import Button from '../../components/Button';

import logoImg from '../../assets/logo.png';


import { Container, Title, BackToSign, BackToSignText} from './styles'

interface SingUpFormData {
  email: string;
  name: string;
  password: string;
}

const SignUp: React.FC = () => {

  const formEmailRef = useRef<TextInput>(null);
  const formPasswordRef = useRef<TextInput>(null);
  const navigation = useNavigation();
  const formRef = useRef<FormHandles>(null);

  const formSubmit = useCallback(
    async (data: SingUpFormData) => {
      try {
        formRef.current?.setErrors({});
        const schema = Yup.object().shape({
          name: Yup.string().required('Nome obrigatório'),
          email: Yup.string()
            .required('E-mail obrigatório')
            .email('Digite um e-mail válido'),
          password: Yup.string().min(6, 'No mínimo 6 digitos'),
        });

        await schema.validate(schema, {
          abortEarly: false,
        });

        api.post('/users', data);

        Alert.alert(
          'Sucesso',
          'Ocorreu tudo certo, pode fazer o login',
        );

        navigation.goBack();


      } catch (err) {
        if (err instanceof Yup.ValidationError) {
          const errors = getValidationErrors(err);
          formRef.current?.setErrors(errors);

          return;
        }

        Alert.alert(
          'Erro de autenticação',
          'Ocorreu um erro ao fazer o cadastro, cheque as credenciais',
        )
      }
    },
    [navigation],
  );

  return (
    <>
    <ScrollView
      keyboardShouldPersistTaps="handled"
      contentContainerStyle={{flex: 1}}
    >



    <Container>
      <Image source={logoImg} />
      <Title> Crie sua conta </Title>
      <Form ref={formRef } onSubmit={ formSubmit } >
       <Input

          autoCapitalize="words"
          name="name"
          icon="user"
          placeholder="Nome"
          returnKeyType="next"
          onSubmitEditing={() => {
            formEmailRef.current?.focus();
          }}
        />

        <Input
          ref={formEmailRef}
          keyboardType="email-address"
          autoCorrect={false}
          autoCapitalize="none"
          name="email"
          icon="mail"
          placeholder="E-mail"
          returnKeyType="next"
          onSubmitEditing={() => {
            formPasswordRef.current?.focus();
          }}
        />

        <Input
          ref={formPasswordRef}
          secureTextEntry
          name="password"
          icon="lock"
          placeholder="Senha"
          textContentType="newPassword"
          returnKeyType="send"
          onSubmitEditing={() => formRef.current?.submitForm()}
        />

        <Button onPress ={() => formRef.current?.submitForm()}> Criar nova conta </Button>
      </Form>


    </Container>

    <BackToSign onPress={() => navigation.goBack()}>
      <Icons name='arrow-left' size={20} color="#fff" />
      <BackToSignText>Voltar para logon</BackToSignText>
    </BackToSign>
    </ScrollView>
    </>
  )
}

export default SignUp;
