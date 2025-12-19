
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { dbCreateTravel } from '@/lib/supabase';

export default function CreateTrip() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [participants, setParticipants] = useState(['', '']);

    const handleParticipantChange = (index, value) => {
        const newParticipants = [...participants];
        newParticipants[index] = value;
        setParticipants(newParticipants);
    };

    const addParticipant = () => {
        setParticipants([...participants, '']);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        const formData = new FormData(e.target);
        const travelData = {
            name: formData.get('travel-name'),
            start_date: formData.get('start-date'),
            end_date: formData.get('end-date'),
            country: formData.get('country'),
            currency: formData.get('currency'),
            exchange_rate: parseFloat(formData.get('exchange-rate')) / 10 // Normalize to 1 unit
        };

        const validParticipants = participants.filter(p => p.trim() !== '');

        if (validParticipants.length < 1) {
            alert('최소 1명의 참여자가 필요합니다.');
            setLoading(false);
            return;
        }

        try {
            const travel = await dbCreateTravel(travelData, validParticipants);

            // Save to localStorage for "Recent Travels"
            const recent = JSON.parse(localStorage.getItem('recentTravels') || '[]');
            recent.unshift(travel);
            localStorage.setItem('recentTravels', JSON.stringify(recent));

            router.push(`/trip/${travel.id}`);
        } catch (error) {
            console.error(error);
            alert('여행 생성 중 오류가 발생했습니다.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <section id="create-trip" className="page active">
            <header>
                <Link href="/" className="back-btn">←</Link>
                <h2>여행 만들기</h2>
            </header>
            <div className="content">
                <form id="create-trip-form" onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label>여행명</label>
                        <input type="text" name="travel-name" placeholder="예: 내일은 골프왕" required />
                    </div>
                    <div className="form-group">
                        <label>여행 기간</label>
                        <div className="row">
                            <input type="date" name="start-date" required />
                            <span>~</span>
                            <input type="date" name="end-date" required />
                        </div>
                    </div>
                    <div className="form-group">
                        <label>여행 나라 / 통화</label>
                        <div className="row">
                            <input type="text" name="country" placeholder="국가명" />
                            <select name="currency">
                                <option value="KRW">KRW (원)</option>
                                <option value="USD">USD (달러)</option>
                                <option value="JPY">JPY (엔)</option>
                                <option value="EUR">EUR (유로)</option>
                                <option value="CNY">CNY (위안)</option>
                                <option value="GBP">GBP (파운드)</option>
                            </select>
                        </div>
                    </div>
                    <div className="form-group">
                        <label>고정 환율 (10단위 기준)</label>
                        <input type="number" name="exchange-rate" defaultValue="1" step="0.01" required />
                        <p className="hint">여행 기간 동안 이 환율로 고정됩니다.</p>
                    </div>
                    <div className="form-group">
                        <label>참여자 (정산 동반인)</label>
                        <div id="participant-list">
                            {participants.map((p, index) => (
                                <div key={index} className="participant-input-row">
                                    <input
                                        type="text"
                                        className="participant-name"
                                        placeholder="이름"
                                        value={p}
                                        onChange={(e) => handleParticipantChange(index, e.target.value)}
                                        required={index < 1} // Require at least the first one
                                    />
                                </div>
                            ))}
                        </div>
                        <button type="button" onClick={addParticipant} className="secondary-btn small-btn">+ 인원 추가</button>
                    </div>
                    <div className="button-group">
                        <Link href="/">
                            <button type="button" className="cancel-btn">취소</button>
                        </Link>
                        <button type="submit" className="primary-btn" disabled={loading}>
                            {loading ? '생성 중...' : '생성'}
                        </button>
                    </div>
                </form>
            </div>
        </section>
    );
}
