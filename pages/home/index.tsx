import React, { useState, useEffect } from "react";
import styled, { keyframes } from 'styled-components';

import { useForm } from "react-hook-form";
import { Characters } from "@/models/characteres";
import { baseURL, generateHash } from "@/api/api";

import type { NextPage } from 'next';

import axios from "axios";
import CharactersList from "@/components/charactersList";
import DinamicBackground from "@/components/dinamicBackground";

const Home: NextPage = () => {

    const { register, getValues, handleSubmit } = useForm();
    const [ characters, setCharacters ] = useState<Characters[]>();

    useEffect(() => {
        setCharacters([]);
    }, []);

    const getCharacters = async (query: string) => {
        if(query === '') {
            setCharacters([]);
        } else {
            await axios.get(`${baseURL}/characters?${generateHash()}&nameStartsWith=${query}`).then(({ data }) => {
                setCharacters(data.data.results);
            }).catch((error) => {});
        }
    }

    return (
        <Main>
            <DinamicBackground />
            <Content>
                <Title>Marvel Wiki</Title>
                <SubTitle>Find and discover exclusive facts about your favorite hero</SubTitle>
                <Form onSubmit={ handleSubmit((data) => getCharacters(data.name)) }>
                    <Input type="text"
                        placeholder="Which hero do you want to research today?"
                        {...register("name", {
                            required: true,
                            onChange: (e) => { getCharacters(e.target.value) },
                        })}
                    />
                </Form>
                {
                    getValues("name") !== '' ? 
                        <DisplayHeroes hidden={ getValues("name") === '' }>
                            { <CharactersList characters={ characters } /> }
                        </DisplayHeroes>
                    : null
                }
            </Content>
        </Main>
    )
}

export default Home;

const Main = styled.main`
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
    align-items: center;
`

const Title = styled.h1`
    font-size: 3rem;
    text-align: center;
    font-weight: 700;
    @media screen and (max-width: 505px) {
        font-size: 2rem;
    }
`

const SubTitle = styled.h2`
    font-size: 1.5rem;
    text-align: center;
    @media screen and (max-width: 505px) {
        font-size: 1rem;
    }
`

const Content = styled.div`
    width: 60%;
    z-index: 10;
    display: flex;
    align-items: center;
    flex-direction: column;
    justify-content: center;
`

const Form = styled.form`
    width: 100%;
`

const Input = styled.input`
    width: 98%;
    height: 2.8rem;
    border: none;
    margin: 1rem 0;
    padding: 0 .5rem;
    opacity: .9;
    border-radius: .2rem;
    &:focus {
        outline: none;
    }
    &::placeholder {
        font-size: .8rem;
        font-family: 'Carter One', cursive;
    }
`

const DisplayHeroes = styled.div`
    width: 100%;
    height: 30rem;
    display: inline-block;
    overflow-y: scroll;
    transition: visibility .4s ease-in-out;
    background-color: #413636d8;
    visibility: ${(props) => props.hidden ? 'hidden' : 'visible'};
    animation: ${(props) => props.hidden ? fadeOut : fadeIn } .4s ease-in-out;
`

const fadeIn = keyframes`
  from {
    opacity: 0;
    transform: scale(.25);
  }

  to {
    opacity: 1;
    transform: scale(1);
  }
`;

const fadeOut = keyframes`
  from {
    opacity: 0;
    transform: scale(1);
  }

  to {
    opacity: 1;
    transform: scale(.25);
  }
`;