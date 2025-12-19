
'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

export default function Home() {
    const [recentTravels, setRecentTravels] = useState([]);

    useEffect(() => {
        // Load recent travels from localStorage
        const stored = localStorage.getItem('recentTravels');
        if (stored) {
            try {
                setRecentTravels(JSON.parse(stored));
            } catch (e) {
                console.error('Failed to parse recent travels', e);
            }
        }
    }, []);

    return (
        <section id="home" className="page active">
            <header>
                <h1>여행 가계부</h1>
            </header>
            <div className="content">
                <div id="recent-travels-list">
                    {recentTravels.length === 0 ? (
                        <p style={{ textAlign: 'center', color: '#888', marginTop: '50px' }}>
                            아직 기록된 여행이 없습니다.<br />
                            새로운 여행을 만들어보세요!
                        </p>
                    ) : (
                        recentTravels.map((travel) => (
                            <Link key={travel.id} href={`/trip/${travel.id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                                <div className="travel-card" style={{
                                    padding: '15px',
                                    border: '1px solid #eee',
                                    borderRadius: '10px',
                                    marginBottom: '10px',
                                    cursor: 'pointer',
                                    transition: 'transform 0.2s'
                                }}>
                                    <h3 style={{ margin: '0 0 5px 0' }}>{travel.name}</h3>
                                    <p style={{ fontSize: '0.9rem', color: '#666' }}>
                                        {travel.start_date} ~ {travel.end_date}
                                    </p>
                                </div>
                            </Link>
                        ))
                    )}
                </div>
                <Link href="/create">
                    <button id="btn-go-create" className="primary-btn large-btn" style={{ marginTop: '20px' }}>+</button>
                </Link>
            </div>
        </section>
    );
}
