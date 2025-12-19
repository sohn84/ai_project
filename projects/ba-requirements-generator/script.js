// ===== DOM Elements =====
const meetingInput = document.getElementById('meetingInput');
const outputPreview = document.getElementById('outputPreview');
const outputMarkdown = document.getElementById('outputMarkdown');
const analyzeBtn = document.getElementById('analyzeBtn');
const clearBtn = document.getElementById('clearBtn');
const copyBtn = document.getElementById('copyBtn');
const exportBtn = document.getElementById('exportBtn');
const charCount = document.getElementById('charCount');
const wordCount = document.getElementById('wordCount');

// ===== Event Listeners =====
meetingInput.addEventListener('input', updateStats);
analyzeBtn.addEventListener('click', analyzeAndGenerate);
clearBtn.addEventListener('click', clearAll);
copyBtn.addEventListener('click', copyToClipboard);
exportBtn.addEventListener('click', exportMarkdown);

// ===== Update Input Statistics =====
function updateStats() {
    const text = meetingInput.value;
    const chars = text.length;
    const words = text.trim() ? text.trim().split(/\s+/).length : 0;

    charCount.textContent = `${chars.toLocaleString()} characters`;
    wordCount.textContent = `${words.toLocaleString()} words`;
}

// ===== Main Analysis Function =====
function analyzeAndGenerate() {
    const inputText = meetingInput.value.trim();

    if (!inputText) {
        alert('회의록 텍스트를 입력해주세요.');
        return;
    }

    // Show loading state
    analyzeBtn.disabled = true;
    analyzeBtn.innerHTML = '<span class="icon analyzing">⏳</span> Analyzing...';

    // Simulate processing delay for better UX
    setTimeout(() => {
        const requirements = parseRequirements(inputText);
        const markdown = generateMarkdown(requirements);

        displayOutput(markdown);
        outputMarkdown.value = markdown;

        // Enable action buttons
        copyBtn.disabled = false;
        exportBtn.disabled = false;

        // Reset analyze button
        analyzeBtn.disabled = false;
        analyzeBtn.innerHTML = '<span class="icon">✨</span> Analyze & Generate';
    }, 800);
}

// ===== Parse Requirements from Input Text =====
function parseRequirements(text) {
    const sentences = text.split(/[.!?\n]+/).map(s => s.trim()).filter(s => s.length > 0);

    const requirements = {
        painPoints: [],
        businessGoals: [],
        features: [],
        constraints: [],
        undecided: []
    };

    // Keywords for classification
    const painKeywords = ['문제', '어려움', '불편', '힘들', '어렵', '곤란', 'problem', 'issue', 'difficulty', 'challenge', 'pain'];
    const goalKeywords = ['목표', '달성', '감소', '증가', '향상', '개선', 'goal', 'target', 'achieve', 'reduce', 'increase', 'improve'];
    const constraintKeywords = ['제약', '한계', '마감', '까지', '예정', '완료', 'constraint', 'limitation', 'deadline', 'by', 'until'];
    const undecidedKeywords = ['미정', '논의', '검토', '결정', '필요', 'undecided', 'discuss', 'review', 'need to decide'];
    const featureKeywords = ['할 수 있', '기능', '제공', '지원', '가능', 'can', 'feature', 'provide', 'support', 'able to'];

    sentences.forEach(sentence => {
        const lowerSentence = sentence.toLowerCase();

        // Check for pain points
        if (painKeywords.some(keyword => lowerSentence.includes(keyword))) {
            requirements.painPoints.push(sentence);
        }

        // Check for business goals (especially with numbers/percentages)
        if (goalKeywords.some(keyword => lowerSentence.includes(keyword)) || /\d+%/.test(sentence)) {
            requirements.businessGoals.push(sentence);
        }

        // Check for constraints
        if (constraintKeywords.some(keyword => lowerSentence.includes(keyword))) {
            requirements.constraints.push(sentence);
        }

        // Check for undecided items
        if (undecidedKeywords.some(keyword => lowerSentence.includes(keyword))) {
            requirements.undecided.push(sentence);
        }

        // Check for features
        if (featureKeywords.some(keyword => lowerSentence.includes(keyword))) {
            requirements.features.push(sentence);
        }
    });

    // If no explicit features found, extract action-oriented sentences
    if (requirements.features.length === 0) {
        const actionVerbs = ['추가', '제거', '수정', '변경', '구현', '개발', 'add', 'remove', 'modify', 'change', 'implement', 'develop'];
        sentences.forEach(sentence => {
            const lowerSentence = sentence.toLowerCase();
            if (actionVerbs.some(verb => lowerSentence.includes(verb))) {
                requirements.features.push(sentence);
            }
        });
    }

    return requirements;
}

// ===== Convert Features to User Stories =====
function convertToUserStory(feature) {
    // Clean up the feature text
    feature = feature.trim();

    // If already in user story format, return as is
    if (feature.includes('사용자로서') || feature.toLowerCase().includes('as a user')) {
        return feature;
    }

    // Extract the main action
    let action = feature;
    let purpose = '';

    // Try to identify purpose (text after "위해", "때문에", "for", "to")
    const purposeMarkers = ['위해', '때문에', '하기 위해'];
    for (const marker of purposeMarkers) {
        if (feature.includes(marker)) {
            const parts = feature.split(marker);
            action = parts[0].trim();
            purpose = parts[1] ? parts[1].trim() : '';
            break;
        }
    }

    // Generate user story
    if (purpose) {
        return `사용자로서, ${action}를 할 수 있다. ${purpose} 때문에.`;
    } else {
        return `사용자로서, ${action}를 할 수 있다.`;
    }
}

// ===== Generate Markdown Output =====
function generateMarkdown(requirements) {
    let markdown = '';

    // Section 1: Core Problem & Goals (WHY)
    markdown += '# 핵심 문제 및 목표 (WHY)\n\n';

    // Pain Point
    markdown += '## Pain Point\n';
    if (requirements.painPoints.length > 0) {
        const painPoint = requirements.painPoints.join(' ');
        markdown += `${painPoint}\n\n`;
    } else {
        markdown += '_회의록에서 명시적인 Pain Point가 발견되지 않았습니다. 추가 검토가 필요합니다._\n\n';
    }

    // Business Goal
    markdown += '## Business Goal\n';
    if (requirements.businessGoals.length > 0) {
        const goal = requirements.businessGoals.join(' ');
        markdown += `${goal}\n\n`;
    } else {
        markdown += '_회의록에서 명시적인 Business Goal이 발견되지 않았습니다. 측정 가능한 목표를 정의해야 합니다._\n\n';
    }

    // Section 2: Core Features (WHAT)
    markdown += '# 핵심 기능 목록 (WHAT)\n\n';

    if (requirements.features.length > 0) {
        requirements.features.forEach(feature => {
            const userStory = convertToUserStory(feature);
            markdown += `- ${userStory}\n`;
        });
        markdown += '\n';
    } else {
        markdown += '_회의록에서 명시적인 기능 요구사항이 발견되지 않았습니다. 기능 목록을 추가로 정의해야 합니다._\n\n';
    }

    // Section 3: Undecided/Constraints
    markdown += '# 미결정/제약 사항\n\n';

    const allConstraints = [...requirements.undecided, ...requirements.constraints];

    if (allConstraints.length > 0) {
        allConstraints.forEach(item => {
            markdown += `- ${item}\n`;
        });
        markdown += '\n';
    } else {
        markdown += '_회의록에서 명시적인 미결정 사항이나 제약 사항이 발견되지 않았습니다._\n\n';
    }

    // Add metadata
    markdown += '---\n\n';
    markdown += `_Generated by BA Requirements Generator on ${new Date().toLocaleString('ko-KR')}_\n`;

    return markdown;
}

// ===== Display Output in Preview =====
function displayOutput(markdown) {
    // Convert markdown to HTML for preview
    const html = markdownToHTML(markdown);
    outputPreview.innerHTML = html;
}

// ===== Simple Markdown to HTML Converter =====
function markdownToHTML(markdown) {
    let html = markdown;

    // Headers
    html = html.replace(/^# (.*$)/gm, '<h1>$1</h1>');
    html = html.replace(/^## (.*$)/gm, '<h2>$1</h2>');

    // Bold
    html = html.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');

    // Italic/Emphasis
    html = html.replace(/_(.*?)_/g, '<em>$1</em>');

    // Code
    html = html.replace(/`(.*?)`/g, '<code>$1</code>');

    // Horizontal rule
    html = html.replace(/^---$/gm, '<hr>');

    // Lists
    html = html.replace(/^\- (.*$)/gm, '<li>$1</li>');
    html = html.replace(/(<li>.*<\/li>)/s, '<ul>$1</ul>');

    // Paragraphs
    html = html.split('\n\n').map(para => {
        if (para.trim() && !para.startsWith('<')) {
            return `<p>${para}</p>`;
        }
        return para;
    }).join('\n');

    return html;
}

// ===== Clear All =====
function clearAll() {
    if (meetingInput.value.trim() && !confirm('입력한 내용을 모두 지우시겠습니까?')) {
        return;
    }

    meetingInput.value = '';
    outputPreview.innerHTML = `
        <div class="empty-state">
            <span class="empty-icon">🎯</span>
            <p>분석 결과가 여기에 표시됩니다</p>
            <p class="empty-hint">왼쪽에 회의록을 입력하고 'Analyze & Generate' 버튼을 클릭하세요</p>
        </div>
    `;
    outputMarkdown.value = '';

    copyBtn.disabled = true;
    exportBtn.disabled = true;

    updateStats();
}

// ===== Copy to Clipboard =====
function copyToClipboard() {
    const markdown = outputMarkdown.value;

    navigator.clipboard.writeText(markdown).then(() => {
        // Visual feedback
        const originalText = copyBtn.innerHTML;
        copyBtn.innerHTML = '<span class="icon">✅</span> Copied!';

        setTimeout(() => {
            copyBtn.innerHTML = originalText;
        }, 2000);
    }).catch(err => {
        alert('클립보드 복사에 실패했습니다: ' + err);
    });
}

// ===== Export as Markdown File =====
function exportMarkdown() {
    const markdown = outputMarkdown.value;
    const timestamp = new Date().toISOString().slice(0, 10);
    const filename = `requirements_spec_${timestamp}.md`;

    const blob = new Blob([markdown], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);

    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();

    // Cleanup
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    // Visual feedback
    const originalText = exportBtn.innerHTML;
    exportBtn.innerHTML = '<span class="icon">✅</span> Exported!';

    setTimeout(() => {
        exportBtn.innerHTML = originalText;
    }, 2000);
}

// ===== Initialize =====
updateStats();
