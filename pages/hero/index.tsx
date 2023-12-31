import React, { useState, useEffect } from "react";

import axios from "axios";
import moment from "moment";
import styled from 'styled-components';
import CommicsList from "@/components/commicsList";

import { Commics } from "@/models/commics";
import { useRouter } from 'next/router';
import { Characters } from "@/models/characteres";
import { baseURL, generateHash } from '@/api/api';

import type { NextPage } from 'next';
import { Image, MainComponent } from "@/layout/LayoutComponent";
import LoadingComponent from "@/components/loadingComponent";

const Hero: NextPage = () => {
    
    const router = useRouter();
    const { id } = router.query;

    const [ commics, setCommics ] = useState<Commics[]>();
    const [ loading, setLoading ] = useState<boolean>(true);
    const [ character, setCharacter ] = useState<Characters>();

    const getCharacters = async () => {
        await axios.get(`${baseURL}/characters/${id}?${generateHash()}`).then(({ data }) => {
            setCharacter(data.data.results[0]);
            getCommics(data.data.results[0].comics.collectionURI);
        }).catch((error) => {});
    };

    const getCommics = async (collectionURI: string) => {
        await axios.get(`${collectionURI.split('http').join('https')}?${generateHash()}`).then(({ data }) => {
            setCommics(data.data.results);
            setLoading(false);
        }).catch((error) => {});
    };

    useEffect(() => {
        getCharacters();
    }, []);

    const mainComponent = () => {
        return(
            <MainComponent>
                <h1>{ character?.name }</h1>
                <Content>
                    <DescriptionContainer>
                        <div style={{ marginBottom: '1.2rem' }}>
                            <Span><SpanTitle>Last update: </SpanTitle>{ moment(character?.modified).format('MMMM Do YYYY, h:mm:ss') }</Span>
                            <Span><SpanTitle>Series: </SpanTitle>{ character?.series?.available }</Span>
                            <Span><SpanTitle>Stories: </SpanTitle>{ character?.stories?.available }</Span>
                        </div>
                        <h2 style={{ marginBottom: '1.2rem' }}>Description</h2>
                        <Text style={{ }}>{ character?.description }</Text>
                        <Image src={`${character?.thumbnail?.path}.${character?.thumbnail?.extension}`} alt="Hero" loading="lazy" />
                    </DescriptionContainer>
                    <CommicsContainer>
                        <h2 style={{ marginBottom: '1.2rem' }}>Commics</h2>
                        <CommicsList commics={ commics }></CommicsList>
                    </CommicsContainer>
                </Content>
            </MainComponent>
        )
    }

    return (
        loading ? <LoadingComponent /> : mainComponent()
    )
}

export default Hero;

const Content = styled.div`
    margin: 1rem 0;
    display: flex;
    align-items: flex-start;
    flex-direction: row;
    justify-content: space-between;
    @media screen and (max-width: 630px) {
        flex-direction: column;
    }
`

const DescriptionContainer = styled.div`
    width: 48%;
    @media screen and (max-width: 630px) {
        width: 100%;
    }
`

const CommicsContainer = styled.div`
    width: 48%;
    height: 42rem;
    display: flex;
    align-items: flex-start;
    flex-direction: column;
    justify-content: flex-start;
    border-radius: .5rem;
    @media screen and (max-width: 630px) {
        width: 100%;
        margin-top: 1rem;
    }
`

const Text = styled.p`
    margin: .5rem 0;
    text-align: justify;
    hyphens: auto;
    -ms-hyphens: auto;
    -webkit-hyphens: auto;
`

const SpanTitle = styled.span`
    font-size: 1.2rem;
    font-family: 'Carter One', cursive;
    margin-right: .5rem;
`

const Span = styled.span`
    font-size: .9rem;
    margin-right: 1rem;
`