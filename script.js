// Variables for the intro
let hitokotoText = "";
let welcomeText = "欢迎来到我的小站";
let isTypingHitokoto = true;
let charIndex = 0;
let isIntroComplete = false;
let isPlaying = false; // 添加全局变量以跟踪音频播放状态

// DOM Elements
// Check if intro has been shown before
const hasSeenIntro = localStorage.getItem('hasSeenIntro');
const loadingScreen = document.getElementById('loading-screen');
const introScreen = document.getElementById('intro-screen');
const typingTextElement = document.getElementById('typing-text');
const cursorElement = document.getElementById('cursor');
const headerBar = document.getElementById('header-bar');
const scrollIndicator = document.getElementById('scroll-indicator');
const mainContent = document.getElementById('main-content');
const backgroundMusic = document.getElementById('background-music');
const playPauseBtn = document.getElementById('play-pause-btn');
const playIcon = document.getElementById('play-icon');
const pauseIcon = document.getElementById('pause-icon');
const statusText = document.querySelector('.status-text');

// Wait for background image to load
window.addEventListener('load', () => {
    fetchHitokoto().then(() => {
        setTimeout(() => {
            loadingScreen.style.opacity = '0';
            setTimeout(() => {
                loadingScreen.style.display = 'none';
                
                // 确保顶栏初始状态是显示的
                headerBar.classList.remove('hidden');
                
                if (hasSeenIntro) {
                    introScreen.style.display = 'none';
                    scrollIndicator.style.display = 'none';
                    mainContent.style.transform = 'translateY(0)';
                    isIntroComplete = true;
                    
                    // 延迟隐藏顶栏
                    setTimeout(() => {
                        headerBar.classList.add('hidden');
                    }, 1000);
                    
                    initializeOriginalFunctions();
                } else {
                    introScreen.style.opacity = '1';
                    startTypingEffect();
                }
            }, 500);
        }, 1000);
    });
});
// Fetch hitokoto
async function fetchHitokoto() {
    try {
        const response = await fetch('https://v1.hitokoto.cn/?c=a&c=d&c=i&c=j&c=k&c=l&c=n&c=r&c=t&c=m&c=p&c=e&c=f&c=h');
        const data = await response.json();
        hitokotoText = data.hitokoto;
        // Also set the hitokoto for the main content
        document.querySelector('#hitokoto').textContent = hitokotoText;
    } catch (error) {
        console.error('获取一言失败:', error);
        hitokotoText = '生活不止眼前的苟且，还有诗和远方的田野。';
        document.querySelector('#hitokoto').textContent = hitokotoText;
    }
}
// 在变量声明后添加
let canSkipIntro = true;

// 添加点击事件监听器
introScreen.addEventListener('click', () => {
    if (canSkipIntro) {
        skipIntro();
    }
});

// 添加跳过介绍的函数
function skipIntro() {
    canSkipIntro = false;
    introScreen.style.backgroundColor = 'transparent';
    scrollIndicator.style.opacity = '1';
    
    // 确保顶栏先显示
    headerBar.classList.remove('hidden');
    
    // 延迟隐藏顶栏
    setTimeout(() => {
        headerBar.classList.add('hidden');
    }, 1000);
    
    setupScrollTrigger();
    isIntroComplete = true;
}
// Typing effect for intro
function startTypingEffect() {
    if (isTypingHitokoto) {
        if (charIndex < hitokotoText.length) {
            typingTextElement.textContent += hitokotoText.charAt(charIndex);
            charIndex++;
            setTimeout(startTypingEffect, 100);
        } else {
            // After hitokoto is fully typed, wait 3 seconds and then delete it
            setTimeout(() => {
                deleteTypingEffect();
            }, 3000);
        }
    } else {
        if (charIndex < welcomeText.length) {
            typingTextElement.textContent += welcomeText.charAt(charIndex);
            charIndex++;
            setTimeout(startTypingEffect, 100);
        } else {
            // After welcome text is fully typed, wait 2 seconds and then remove background and show scroll indicator
            setTimeout(() => {
                // 移除黑色背景但保留文字
                introScreen.style.backgroundColor = 'transparent';
                scrollIndicator.style.opacity = '1';
                
                // 不显示顶部栏
                // headerBar.style.transform = 'translateY(0)';
                
                // Set up scroll event listener to show main content
                setupScrollTrigger();
                
                isIntroComplete = true;
            }, 2000);
        }
    }
}

// Delete typing effect
function deleteTypingEffect() {
    if (typingTextElement.textContent.length > 0) {
        typingTextElement.textContent = typingTextElement.textContent.slice(0, -1);
        setTimeout(deleteTypingEffect, 50);
    } else {
        // Switch to welcome text
        isTypingHitokoto = false;
        charIndex = 0;
        startTypingEffect();
    }
}

// Setup scroll trigger
function setupScrollTrigger() {
    let touchStartY = 0;
    let touchEndY = 0;
    
    document.addEventListener('touchstart', (e) => {
        touchStartY = e.touches[0].clientY;
    });
    
    document.addEventListener('touchmove', (e) => {
        if (!isIntroComplete) return;
        
        touchEndY = e.touches[0].clientY;
        const diff = touchStartY - touchEndY;
        
        if (diff > 50) { // User scrolled up enough
            showMainContent();
        }
    });
    
    document.addEventListener('wheel', (e) => {
        if (!isIntroComplete) return;
        
        if (e.deltaY > 0) { // Scrolling down
            showMainContent();
        }
    });
}

// Show main content
function showMainContent() {
    introScreen.style.opacity = '0';
    scrollIndicator.style.opacity = '0';
    
    // 确保顶栏先显示然后再隐藏
    headerBar.classList.remove('hidden');

    setTimeout(() => {
        introScreen.style.display = 'none';
        scrollIndicator.style.display = 'none';
        mainContent.style.transform = 'translateY(0)';
        localStorage.setItem('hasSeenIntro', 'true');

        // 延迟一段时间后隐藏顶栏
        setTimeout(() => {
            headerBar.classList.add('hidden');
        }, 1000);

        // Auto play audio
        backgroundMusic.play().catch(() => {
            updatePlayStatus();
        });

        initializeOriginalFunctions();
    }, 500);
}

// Music control functions
function togglePlay() {
    if (isPlaying) {
        backgroundMusic.pause();
    } else {
        backgroundMusic.play();
    }
    
    updatePlayStatus();
}

function updatePlayStatus() {
    isPlaying = !backgroundMusic.paused;
    playIcon.style.display = isPlaying ? 'none' : 'inline';
    pauseIcon.style.display = isPlaying ? 'inline' : 'none';
    statusText.textContent = isPlaying ? '正在播放' : '播放';
}

// Initialize all original functions
function initializeOriginalFunctions() {
    const musicControl = document.getElementById('music-control');
    let collapseTimeout;
    
    // 注意：移除对isPlaying的局部定义，使用全局变量
    
    function startCollapseTimer() {
        clearTimeout(collapseTimeout);
        collapseTimeout = setTimeout(() => {
            musicControl.classList.add('collapsed');
        }, 3000);
    }
    
    musicControl.addEventListener('click', (e) => {
        if (musicControl.classList.contains('collapsed')) {
            musicControl.classList.remove('collapsed');
            startCollapseTimer();
        }
    });
    
    musicControl.addEventListener('mouseenter', () => {
        clearTimeout(collapseTimeout);
        musicControl.classList.remove('collapsed');
    });
    
    musicControl.addEventListener('mouseleave', () => {
        startCollapseTimer();
    });
    
    // Start collapse timer
    startCollapseTimer();
    
    // Music player
    playPauseBtn.addEventListener('click', togglePlay);
    
    // Monitor audio playback status
    backgroundMusic.addEventListener('playing', updatePlayStatus);
    backgroundMusic.addEventListener('pause', updatePlayStatus);
    
    // 初始化播放状态
    updatePlayStatus();
    
    // Time functions
    function updateTime() {
        const now = new Date();
        const timeElement = document.getElementById('current-time');
        const dateElement = document.getElementById('current-date');
        
        timeElement.textContent = now.toLocaleTimeString('zh-CN');
        dateElement.textContent = now.toLocaleDateString('zh-CN', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    }
    // 添加时钟点击事件
    const timeContainer = document.querySelector('.time-container');
    let isEnlarged = false;

    timeContainer.addEventListener('click', function() {
        if (!isEnlarged) {
            this.classList.add('enlarged');
            isEnlarged = true;
            
            // 添加第二次点击的延时，避免立即跳转
            setTimeout(() => {
                this.addEventListener('click', function secondClick() {
                    window.location.href = './clock.html';
                    // 移除第二次点击事件监听器
                    this.removeEventListener('click', secondClick);
                }, { once: true });
            }, 300);
            
            // 当鼠标移出时，重置状态
            this.addEventListener('mouseleave', function() {
                this.classList.remove('enlarged');
                isEnlarged = false;
            });
        }
    });
    function calculateRunningTime() {
        const startTime = new Date('2025-1-29').getTime(); // Site start date
        const now = new Date().getTime();
        const difference = now - startTime;
        
        const days = Math.floor(difference / (1000 * 60 * 60 * 24));
        const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((difference % (1000 * 60)) / 1000);
        
    document.getElementById('running-time').textContent = 
            `网站已运行：${days}天${hours}小时${minutes}分${seconds}秒`;
    }
    
    function checkDarkMode() {
        const hour = new Date().getHours();
        if (hour >= 23 || hour < 2) {
            document.body.classList.add('dark-mode');
        } else {
            document.body.classList.remove('dark-mode');                        
        }
    }
    
    // Initialize time and hitokoto refresh
    setInterval(updateTime, 1000);
    updateTime();
    
    const avatarContainer = document.querySelector('.avatar-container');
    avatarContainer.addEventListener('click', function() {
        this.style.transform = 'scale(0.9)';
        setTimeout(() => {
            this.style.transform = 'scale(1)';
        }, 150);
    });
    
    // Periodic hitokoto refresh
    setInterval(() => {
        fetchHitokoto();
    }, 300000); // every 5 minutes
    
    setInterval(calculateRunningTime, 1000);
    calculateRunningTime();
    
    checkDarkMode();
    setInterval(checkDarkMode, 60000); // Check dark mode every minute
}
<!-- Cloudflare Web Analytics --><script defer src='https://static.cloudflareinsights.com/beacon.min.js' data-cf-beacon='{"token": "afe56ce9d3db4562aa944fce6924a841"}'></script><!-- End Cloudflare Web Analytics -->
