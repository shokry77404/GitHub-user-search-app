
        document.addEventListener('DOMContentLoaded', function() {
         
            const themeToggle = document.getElementById('theme-toggle');
            const themeText = document.getElementById('theme-text');
            const themeIcon = document.getElementById('theme-icon');
            const searchInput = document.getElementById('username');
            const searchBtn = document.getElementById('search-btn');
            const errorMessage = document.getElementById('error-message');
            const userCard = document.getElementById('user-card');
            const initialState = document.getElementById('initial-state');
            const loading = document.getElementById('loading');
            
     
            const avatar = document.getElementById('avatar');
            const name = document.getElementById('name');
            const login = document.getElementById('login');
            const joined = document.getElementById('joined');
            const bio = document.getElementById('bio');
            const repos = document.getElementById('repos');
            const followers = document.getElementById('followers');
            const following = document.getElementById('following');
            const locationElem = document.getElementById('location');
            const blog = document.getElementById('blog');
            const twitter = document.getElementById('twitter');
            const company = document.getElementById('company');
            
            const savedTheme = localStorage.getItem('theme');
            if (savedTheme === 'dark') {
                document.documentElement.setAttribute('data-theme', 'dark');
                themeIcon.classList.remove('fa-moon');
                themeIcon.classList.add('fa-sun');
                themeText.textContent = 'فاتح';
            } else {
                themeIcon.classList.remove('fa-sun');
                themeIcon.classList.add('fa-moon');
                themeText.textContent = 'مظلم';
                localStorage.setItem('theme', 'light');
            }
     
            themeToggle.addEventListener('click', function() {
                const currentTheme = document.documentElement.getAttribute('data-theme');
                
                if (currentTheme === 'dark') {
                    document.documentElement.removeAttribute('data-theme');
                    themeIcon.classList.remove('fa-sun');
                    themeIcon.classList.add('fa-moon');
                    themeText.textContent = 'مظلم';
                    localStorage.setItem('theme', 'light');
                } else {
                    document.documentElement.setAttribute('data-theme', 'dark');
                    themeIcon.classList.remove('fa-moon');
                    themeIcon.classList.add('fa-sun');
                    themeText.textContent = 'فاتح';
                    localStorage.setItem('theme', 'dark');
                }
            });
            
       
            searchBtn.addEventListener('click', searchUser);
            
 
            searchInput.addEventListener('keypress', function(e) {
                if (e.key === 'Enter') {
                    searchUser();
                }
            });
            
          
            function searchUser() {
                const username = searchInput.value.trim();
                
                if (!username) {
                    showError('يرجى إدخال اسم مستخدم');
                    return;
                }
                
             
                hideError();
                hideInitialState();
                showLoading();
                hideUserCard();
                
                // جلب بيانات المستخدم من GitHub API
                fetch(`https://api.github.com/users/${username}`)
                    .then(response => {
                        if (!response.ok) {
                            if (response.status === 404) {
                                throw new Error('المستخدم غير موجود');
                            } else if (response.status === 403) {
                                throw new Error('تم تجاوز حد طلبات API');
                            } else {
                                throw new Error('حدث خطأ في الاتصال');
                            }
                        }
                        return response.json();
                    })
                    .then(data => {
                        displayUser(data);
                        hideLoading();
                        showUserCard();
                    })
                    .catch(error => {
                        showError(error.message);
                        hideLoading();
                        showInitialState();
                    });
            }
            
  
            function displayUser(userData) {
              
                avatar.src = userData.avatar_url;
                avatar.alt = `صورة ${userData.login}`;
                name.textContent = userData.name || userData.login;
                login.textContent = `@${userData.login}`;
                
      
                const joinDate = new Date(userData.created_at);
                const options = { year: 'numeric', month: 'long', day: 'numeric' };
                joined.textContent = `انضم في ${joinDate.toLocaleDateString('ar-SA', options)}`;
                
                
                bio.textContent = userData.bio || 'هذا المستخدم ليس لديه نبذة تعريفية.';
                

                repos.textContent = userData.public_repos.toLocaleString();
                followers.textContent = userData.followers.toLocaleString();
                following.textContent = userData.following.toLocaleString();
                
             
                updateLink(locationElem, userData.location, 'غير متوفر');
                updateBlogLink(blog, userData.blog, 'غير متوفر');
                updateTwitterLink(twitter, userData.twitter_username, 'غير متوفر');
                updateLink(company, userData.company, 'غير متوفر');
            }
            
           
            function updateLink(element, value, placeholder) {
                if (value) {
                    element.classList.remove('unavailable');
                    element.querySelector('span').textContent = value;
                } else {
                    element.classList.add('unavailable');
                    element.querySelector('span').textContent = placeholder;
                }
            }
            
       
            function updateBlogLink(element, value, placeholder) {
                if (value) {
                    element.classList.remove('unavailable');
               
                    const blogUrl = value.startsWith('http') ? value : `https://${value}`;
                    element.innerHTML = `<i class="fas fa-link" aria-hidden="true"></i> <span><a href="${blogUrl}" target="_blank" rel="noopener noreferrer">${value.length > 20 ? value.substring(0, 20) + '...' : value}</a></span>`;
                } else {
                    element.classList.add('unavailable');
                    element.innerHTML = `<i class="fas fa-link" aria-hidden="true"></i> <span>${placeholder}</span>`;
                }
            }
            
       
            function updateTwitterLink(element, value, placeholder) {
                if (value) {
                    element.classList.remove('unavailable');
                    element.innerHTML = `<i class="fab fa-twitter" aria-hidden="true"></i> <span><a href="https://twitter.com/${value}" target="_blank" rel="noopener noreferrer">@${value}</a></span>`;
                } else {
                    element.classList.add('unavailable');
                    element.innerHTML = `<i class="fab fa-twitter" aria-hidden="true"></i> <span>${placeholder}</span>`;
                }
            }
      
            function showError(message) {
                errorMessage.textContent = message;
                errorMessage.style.display = 'block';
            }
            
            function hideError() {
                errorMessage.style.display = 'none';
            }
            
            function showLoading() {
                loading.style.display = 'flex';
            }
            
            function hideLoading() {
                loading.style.display = 'none';
            }
            
            function showInitialState() {
                initialState.style.display = 'flex';
            }
            
            function hideInitialState() {
                initialState.style.display = 'none';
            }
            
            function showUserCard() {
                userCard.classList.add('visible');
            }
            
            function hideUserCard() {
                userCard.classList.remove('visible');
            }
            
           
            searchInput.focus();
        });