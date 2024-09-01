import axios from 'axios';
import React, { useEffect, useState } from 'react';

import './css/newsFeed.scss'

const API_KEY = '0f0463f328e74327bc52f5961e1febc3';

const NewsFeed: React.FC = () => {
    const [news, setNews] = useState<any[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        //Хотелось бы еще реализовать функцию перевода на другие языки, но сложновата реализация оказалась
        const updateNews = async () => {
            try {
                
                const response = await axios.get('https://newsapi.org/v2/everything', {
                    params: {
                        q: 'crypto', 
                        apiKey: API_KEY,
                        pageSize: 10,
                        sortBy: 'relevancy',
                        language:'ru'
                    }
                });
                setNews(response.data.articles);
            } catch (error) {
                setError('Ошибка при получении новостей.');
            } finally {
                setLoading(false);
            }
        };

        updateNews();
    }, []);

    if (loading) return <p>Загрузка...</p>;
    if (error) return <p>{error}</p>;

    return (
        <div className="news-container">
            <h1>Новости о криптовалюте и валюте</h1>
            <div className="news-grid">
                {news.map((article, index) => (
                    <div key={index} className="news-card">
                        <img src={article.urlToImage} alt={article.title} className="news-card-image" />
                        <div className="news-card-content">
                            <h2 className="news-card-title">{article.title}</h2>
                            <p className="news-card-description">{article.description}</p>
                            <a href={article.url} target="_blank" rel="noopener noreferrer" className="news-card-link">
                                Читать далее
                            </a>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default NewsFeed;