        document.addEventListener('DOMContentLoaded', function() {
            const themeToggle = document.getElementById('theme-toggle');
            const themeText = document.getElementById('theme-text');
            const themeIcon = document.getElementById('theme-icon');
            const searchBtn = document.getElementById('search-btn');
            const usernameInput = document.getElementById('username');
            const errorMessage = document.getElementById('error-message');
            const loadingEl = document.getElementById('loading');
            const initialStateEl = document.getElementById('initial-state');
            const userCardEl = document.getElementById('user-card');
            
            const avatarEl = document.getElementById('avatar');
            const nameEl = document.getElementById('name');
            const loginEl = document.getElementById('login');
            const joinedEl = document.getElementById('joined');
            const bioEl = document.getElementById('bio');
            const reposEl = document.getElementById('repos');
            const followersEl = document.getElementById('followers');
            const followingEl = document.getElementById('following');
            const locationEl = document.getElementById('location');
            const blogEl = document.getElementById('blog');
            const twitterEl = document.getElementById('twitter');
            const companyEl = document.getElementById('company');
            
            themeToggle.addEventListener('click', function() {
                document.body.classList.toggle('light-theme');
                
                if (document.body.classList.contains('light-theme')) {
                    themeText.textContent = 'LIGHT';
                    themeIcon.className = 'fas fa-sun';
                } else {
                    themeText.textContent = 'DARK';
                    themeIcon.className = 'fas fa-moon';
                }
            });
            
            searchBtn.addEventListener('click', searchUser);
            usernameInput.addEventListener('keypress', function(e) {
                if (e.key === 'Enter') {
                    searchUser();
                }
            });
            
            showInitialState();
            
            function searchUser() {
                const username = usernameInput.value.trim();
                
                if (!username) {
                    showError('Please enter a username');
                    return;
                }
                
                showLoading();
                
                clearError();
                
                fetch(`https://api.github.com/users/${username}`)
                    .then(response => {
                        if (!response.ok) {
                            if (response.status === 404) {
                                throw new Error('User not found');
                            } else {
                                throw new Error('Error fetching user data');
                            }
                        }
                        return response.json();
                    })
                    .then(data => {
                        updateUserCard(data);
                        showUserCard();
                    })
                    .catch(error => {
                        showError(error.message);
                        showInitialState();
                    });
            }
            
            function updateUserCard(user) {
                avatarEl.src = user.avatar_url || '';
                avatarEl.alt = `${user.login}'s avatar`;
                
                nameEl.textContent = user.name || user.login;
                loginEl.textContent = `@${user.login}`;
                
                const joinDate = new Date(user.created_at);
                const options = { day: 'numeric', month: 'short', year: 'numeric' };
                joinedEl.textContent = `Joined ${joinDate.toLocaleDateString('en-GB', options)}`;
                
                bioEl.textContent = user.bio || 'This profile has no bio';
                
                reposEl.textContent = user.public_repos || 0;
                followersEl.textContent = user.followers || 0;
                followingEl.textContent = user.following || 0;
                
                updateLink(locationEl, user.location, 'fas fa-map-marker-alt');
                
                if (user.blog) {
                    const blogUrl = user.blog.startsWith('http') ? user.blog : `https://${user.blog}`;
                    updateLink(blogEl, blogUrl, 'fas fa-link', true);
                } else {
                    updateLink(blogEl, 'Not Available', 'fas fa-link');
                }
                
                updateLink(twitterEl, user.twitter_username ? `@${user.twitter_username}` : 'Not Available', 'fab fa-twitter');
                
                updateLink(companyEl, user.company || 'Not Available', 'fas fa-building');
            }
            
            function updateLink(element, text, iconClass, isLink = false) {
                const icon = element.querySelector('i');
                const span = element.querySelector('span');
                
                icon.className = iconClass;
                span.textContent = text;
                
                if (isLink && text !== 'Not Available') {
                    element.classList.remove('unavailable');
                    span.innerHTML = `<a href="${text}" target="_blank" rel="noopener noreferrer">${text}</a>`;
                } else if (text === 'Not Available') {
                    element.classList.add('unavailable');
                } else {
                    element.classList.remove('unavailable');
                }
            }
            
            function showLoading() {
                loadingEl.style.display = 'flex';
                initialStateEl.style.display = 'none';
                userCardEl.style.display = 'none';
            }
            
            function showInitialState() {
                loadingEl.style.display = 'none';
                initialStateEl.style.display = 'flex';
                userCardEl.style.display = 'none';
            }
            
            function showUserCard() {
                loadingEl.style.display = 'none';
                initialStateEl.style.display = 'none';
                userCardEl.style.display = 'grid';
            }
            
            function showError(message) {
                errorMessage.textContent = message;
                errorMessage.style.display = 'block';
                setTimeout(clearError, 5000);
            }
            
            function clearError() {
                errorMessage.style.display = 'none';
            }
            
            function loadDefaultUser() {
                fetch('https://api.github.com/users/octocat')
                    .then(response => response.json())
                    .then(data => {
                        updateUserCard(data);
                        showUserCard();
                    })
                    .catch(() => {
                        showInitialState();
                    });
            }
            
            loadDefaultUser();
        });