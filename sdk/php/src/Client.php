<?php

namespace CryptoNews;

use CryptoNews\Endpoints\DeFi;
use CryptoNews\Endpoints\Market;
use CryptoNews\Endpoints\News;
use CryptoNews\Endpoints\OnChain;
use CryptoNews\Http\HttpClient;

class Client
{
    private string $baseUrl;
    private HttpClient $http;

    public News $news;
    public Market $market;
    public DeFi $defi;
    public OnChain $onchain;

    public function __construct(string $baseUrl = 'https://cryptocurrency.cv', int $timeout = 30)
    {
        $this->baseUrl = rtrim($baseUrl, '/');
        $this->http = new HttpClient($this->baseUrl, $timeout);
        $this->news = new News($this->http);
        $this->market = new Market($this->http);
        $this->defi = new DeFi($this->http);
        $this->onchain = new OnChain($this->http);
    }

    /**
     * Check API health status.
     *
     * @return array<string, mixed>
     */
    public function health(): array
    {
        return $this->http->get('/api/health');
    }

    /**
     * Get API statistics.
     *
     * @return array<string, mixed>
     */
    public function stats(): array
    {
        return $this->http->get('/api/stats');
    }

    /**
     * Get RSS feed URL.
     */
    public function rssUrl(string $feed = 'all'): string
    {
        if ($feed === 'all') {
            return $this->baseUrl . '/api/rss';
        }
        return $this->baseUrl . '/api/rss?feed=' . urlencode($feed);
    }

    /**
     * Get Atom feed URL.
     */
    public function atomUrl(string $feed = 'all'): string
    {
        if ($feed === 'all') {
            return $this->baseUrl . '/api/atom';
        }
        return $this->baseUrl . '/api/atom?feed=' . urlencode($feed);
    }
}
