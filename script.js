// GLOBALS — declarados antes de DOMContentLoaded para evitar crashes de scope
var chartsRendered = false;
var currentLang = localStorage.getItem('i18n-lang') || 'es';

function showTab(tabId, clickedBtn) {
    document.querySelectorAll('.tab-content').forEach(function (t) {
        t.classList.remove('active');
    });
    document.querySelectorAll('.tab-btn').forEach(function (b) {
        b.classList.remove('active');
    });
    var tab = document.getElementById('tab-' + tabId);
    if (tab) tab.classList.add('active');
    if (clickedBtn) clickedBtn.classList.add('active');
}

function toggleMenu() {
    document.querySelector('.nav-links').classList.toggle('open');
}

document.addEventListener('DOMContentLoaded', () => {
    // 1. Intersection Observer for Scroll Animations (fade-in)
    const fadeElements = document.querySelectorAll('.fade-in');

    // Check if user prefers reduced motion
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

    if (!prefersReducedMotion.matches) {
        const observerOptions = {
            root: null,
            rootMargin: '0px',
            threshold: 0.1
        };

        const observer = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    // Once visible, animate the skill bars if they exist inside
                    const hudFills = entry.target.querySelectorAll('.hud-fill');
                    hudFills.forEach(fill => {
                        fill.style.width = fill.getAttribute('data-percent');
                    });

                    // Initialize charts if impact section is visible
                    if (entry.target.id === 'impact' && typeof Chart !== 'undefined') {
                        initImpactCharts();
                    }

                    observer.unobserve(entry.target);
                }
            });
        }, observerOptions);

        fadeElements.forEach(el => observer.observe(el));
    } else {
        // If reduced motion, show everything immediately
        fadeElements.forEach(el => el.classList.add('visible'));
        document.querySelectorAll('.hud-fill').forEach(fill => {
            fill.style.width = fill.getAttribute('data-percent');
        });
        if (typeof Chart !== 'undefined') {
            initImpactCharts();
        }
    }

    // 2. Glitch effect removed from global setup to place it inside updateLanguage dynamically

    // 4. i18n Translation Dictionary
    const i18n = {
        es: {
            nav_about: "SOBRE MÍ",
            nav_skills: "HABILIDADES",
            nav_impact: "IMPACTO",
            nav_projects: "PROYECTOS",
            nav_experience: "EXPERIENCIA",
            nav_contact: "CONTACTO",
            hero_boot: "SYS: INICIANDO...",
            hero_tagline: '"Transformo datos en decisiones de negocio."',
            hero_subtitle: "Ayudo a empresas a entender sus números y tomar mejores decisiones — desde el análisis hasta el dashboard.",
            about_title: "01.<span class='glitch-hover' data-text='SOBRE_MÍ'>SOBRE_MÍ</span>",
            about_subtitle: "// Quién soy y de dónde vengo",
            about_credentials: "> CREDENCIALES:",
            about_cred_1: "Ingeniero en Computación — UAGro, 2023",
            about_cred_2: "Certificación en Análisis de Datos (TripleTen)",
            about_profile: "> PERFIL:",
            about_profile_text: "Combino análisis de datos con desarrollo de software. Entiendo tanto los números como los sistemas que los generan, lo que me permite encontrar soluciones más completas.",
            about_location: "> UBICACIÓN:",
            about_location_text: "Basado en México. Disponible para trabajo remoto.",
            skills_title: "02.<span class='glitch-hover' data-text='MIS_HABILIDADES'>MIS_HABILIDADES</span>",
            skills_subtitle: "// Herramientas con las que trabajo",
            tab_data: "[ DATOS Y BI ]",
            tab_db: "[ BASES DE DATOS ]",
            tab_web: "[ WEB Y DESARROLLO ]",
            tab_tools: "[ HERRAMIENTAS ]",
            impact_title: "03.<span class='glitch-hover' data-text='MI_IMPACTO'>MI_IMPACTO</span>",
            impact_subtitle: "// Resultados reales que he generado",
            chart1_title: "Automatización de Procesos",
            chart1_desc: "Reduje tiempos de trabajo manual implementando mis propias soluciones",
            chart1_note: "* Comparado con línea base previa a la implementación",
            chart2_title: "Crecimiento que he generado",
            chart2_desc: "Métricas de negocio que mejoraron directamente gracias a mi trabajo",
            chart3_title: "Modelo ML — Predicción de Cancelaciones",
            chart3_desc: "Modelo entrenado con 7,000+ registros para detectar clientes a punto de cancelar su servicio",
            chart3_note: "Random Forest | 7,043 registros | 20+ variables analizadas",
            chart4_title: "Escala de Operaciones",
            chart4_desc: "Volumen de datos y carga gestionada constantemente",
            projects_title: "04.<span class='glitch-hover' data-text='MIS_PROYECTOS'>MIS_PROYECTOS</span>",
            projects_subtitle: "// Cosas que he construido",
            proj_data_title: "[ ANÁLISIS DE DATOS ]",
            proj_data_desc: "Predicción, EDA, BI",
            proj_web_title: "[ DESARROLLO WEB ]",
            proj_web_desc: "E-commerce, CRM, full-stack",
            proj_btn: "Ver proyecto &gt;",
            proj_problem: "🔍 El problema:",
            proj_stack: "🛠 Cómo lo resolví:",
            proj_result: "✅ Resultado:",
            exp_title: "05.<span class='glitch-hover' data-text='EXPERIENCIA'>EXPERIENCIA</span>",
            exp_subtitle: "// Dónde he trabajado y qué logré",
            exp_role1: "Desarrollador Web",
            exp_role2: "Soporte TI",
            exp_role3: "Soporte Técnico y Ventas",
            exp_present: "Presente",
            exp_log1: "Mejoré tiempos de carga 25% y aumenté la tasa de conversión 18%",
            exp_log2: "Automaticé procesos reduciendo el trabajo manual en un 40%",
            exp_log3: "Apoyé el crecimiento del 60% en ventas con análisis de inventario",
            contact_title: "06.<span class='glitch-hover' data-text='CONTÁCTAME'>CONTÁCTAME</span>",
            contact_subtitle: "// Estoy abierto a nuevas oportunidades",
            contact_status: "DISPONIBLE",
            contact_awaiting: "Escríbeme y te respondo en menos de 24 horas.",
            contact_id: "IDENTIFICADOR",
            contact_id_place: "Tu nombre",
            contact_msg: "DATOS_DE_CARGA",
            contact_msg_place: "¿En qué puedo ayudarte?",
            contact_btn: "Enviar mensaje &gt;",
            footer: "SYS.COPYRIGHT © 2026 BALTAZAR DIMAYUGA. TODOS LOS DERECHOS RESERVADOS."
        },
        en: {
            nav_about: "ABOUT",
            nav_skills: "SKILLS",
            nav_impact: "IMPACT",
            nav_projects: "PROJECTS",
            nav_experience: "EXPERIENCE",
            nav_contact: "CONTACT",
            hero_boot: "SYS: BOOT SEQUENCE INITIATED...",
            hero_tagline: '"Turning raw data into business decisions."',
            hero_subtitle: "I help companies make better decisions using data — from raw numbers to clear dashboards.",
            about_title: "01.<span class='glitch-hover' data-text='ABOUT_ME'>ABOUT_ME</span>",
            about_subtitle: "// Who I am and my background",
            about_credentials: "> CREDENTIALS:",
            about_cred_1: "Computer Engineer (UAGro 2023)",
            about_cred_2: "Data Analytics Certification (TripleTen)",
            about_profile: "> PROFILE:",
            about_profile_text: "Hybrid focus bridging data analytics with full-stack development. I build robust models while understanding the infrastructure behind them.",
            about_location: "> LOCATION:",
            about_location_text: "Based in Mexico. Open to remote operations globally.",
            skills_title: "02.<span class='glitch-hover' data-text='SYSTEM_CAPABILITIES'>SYSTEM_CAPABILITIES</span>",
            skills_subtitle: "// What I work with daily",
            tab_data: "[ DATA & BI ]",
            tab_db: "[ DATABASES ]",
            tab_web: "[ WEB & DEV ]",
            tab_tools: "[ TOOLS ]",
            impact_title: "03.<span class='glitch-hover' data-text='MY_IMPACT'>MY_IMPACT</span>",
            impact_subtitle: "// Real business results I've generated",
            chart1_title: "Process Automation",
            chart1_desc: "Reduction in management times after implementing custom solutions",
            chart1_note: "* Compared to baseline prior to implementation",
            chart2_title: "Growth Contribution",
            chart2_desc: "Business metrics directly improved by my work",
            chart3_title: "ML Model — Churn Prediction",
            chart3_desc: "Model trained on 7,000+ records to identify at-risk telecom clients",
            chart3_note: "Random Forest | Dataset: 7,043 records | 20+ features",
            chart4_title: "Scale of Operations",
            chart4_desc: "Data volume and workflows managed in production",
            projects_title: "04.<span class='glitch-hover' data-text='MY_PROJECTS'>MY_PROJECTS</span>",
            projects_subtitle: "// Works and projects I've built",
            proj_data_title: "[ DATA_ANALYTICS ]",
            proj_data_desc: "Churn prediction, EDA, BI",
            proj_web_title: "[ WEB_DEVELOPMENT ]",
            proj_web_desc: "E-commerce, CRM, full-stack",
            proj_btn: "VIEW PROJECTS",
            proj_problem: "🔍 Challenge:",
            proj_stack: "🛠 Stack:",
            proj_result: "✅ Result:",
            exp_title: "05.<span class='glitch-hover' data-text='WORK_EXPERIENCE'>WORK_EXPERIENCE</span>",
            exp_subtitle: "// Where I've worked and what I achieved",
            exp_role1: "Web Developer",
            exp_role2: "IT Support & Sales",
            exp_present: "Present",
            exp_log1: "Improved loading times by 25% and increased conversion by 18%",
            exp_log2: "Automated processes reducing management times by 40%",
            exp_log3: "Contributed to 60% sales growth with inventory analysis",
            contact_title: "06.<span class='glitch-hover' data-text='CONTACT_ME'>CONTACT_ME</span>",
            contact_subtitle: "// Let's talk — I am available",
            contact_status: "STATUS: ONLINE",
            contact_awaiting: "I am open to new opportunities. Write to me and I will respond within 24 hours.",
            contact_id: "IDENTIFIER",
            contact_id_place: "Your name",
            contact_msg: "PAYLOAD_DATA",
            contact_msg_place: "Your message",
            contact_btn: "SEND MESSAGE &gt;",
            footer: "SYS.COPYRIGHT © 2026 BALTAZAR DIMAYUGA. ALL RIGHTS RESERVED."
        }
    };


    function updateLanguage(lang) {
        currentLang = lang;
        localStorage.setItem('i18n-lang', lang);

        // Update active button state
        document.getElementById('lang-es').classList.toggle('active', lang === 'es');
        document.getElementById('lang-en').classList.toggle('active', lang === 'en');

        // Update DOM elements
        document.querySelectorAll('[data-i18n]').forEach(el => {
            // SKIP los tab-buttons — no tocarlos con innerHTML
            if (el.classList.contains('tab-btn')) return;

            const key = el.getAttribute('data-i18n');
            if (i18n[lang] && i18n[lang][key]) {
                el.innerHTML = i18n[lang][key];
            }
        });

        // Actualizar tab buttons de forma segura — solo el texto, sin tocar onclick
        document.querySelectorAll('.tab-btn').forEach(btn => {
            const key = btn.getAttribute('data-i18n');
            if (key && i18n[lang] && i18n[lang][key]) {
                btn.textContent = i18n[lang][key];
            }
        });

        // Update exact placeholders for specific text areas globally
        document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
            const key = el.getAttribute('data-i18n-placeholder');
            if (i18n[lang][key]) {
                el.placeholder = i18n[lang][key];
            }
        });

        // Update Chart contents if they exist
        if (chartsRendered && window.myCharts) {
            updateChartsText(lang);
        }

        // Re-render KPI cards
        renderKPICards(lang);

        // Re-attach glitch hovers internally reset by innerHTML
        attachGlitchHovers();
    }

    document.getElementById('lang-es').addEventListener('click', () => updateLanguage('es'));
    document.getElementById('lang-en').addEventListener('click', () => updateLanguage('en'));

    // Apply init language
    updateLanguage(currentLang);


    // Impact Charts Initialization
    window.myCharts = {}; // Store instances to update language

    function initImpactCharts() {
        if (chartsRendered) return;
        chartsRendered = true;

        const chartColors = {
            primary: '#FF5621',
            primaryGlow: 'rgba(255, 86, 33, 0.4)',
            bg: 'rgba(255, 255, 255, 0.05)',
            text: '#F6F6F6',
            grid: '#333333'
        };

        const commonOptions = {
            responsive: true,
            maintainAspectRatio: false,
            color: chartColors.text,
            plugins: {
                legend: { display: false }
            },
            scales: {
                x: { grid: { color: chartColors.grid }, ticks: { color: chartColors.text, font: { family: "'Share Tech Mono', monospace" } } },
                y: { grid: { color: chartColors.grid }, ticks: { color: chartColors.text, font: { family: "'Share Tech Mono', monospace" } } }
            }
        };

        // Chart 1: Bar - Process Efficiency
        window.myCharts.c1 = new Chart(document.getElementById('chart1'), {
            type: 'bar',
            data: {
                labels: currentLang === 'es' ? ['Base manual', 'Tras auto PHP', 'Tras opt web'] : ['Manual Base', 'PHP Auto', 'Web Opt'],
                datasets: [{
                    label: '%',
                    data: [100, 60, 75],
                    backgroundColor: chartColors.primaryGlow,
                    borderColor: chartColors.primary,
                    borderWidth: 1
                }]
            },
            options: commonOptions
        });

        // Chart 2: Horizontal Bar - Business Growth
        window.myCharts.c2 = new Chart(document.getElementById('chart2'), {
            type: 'bar',
            data: {
                labels: currentLang === 'es' ? ['Ventas', 'Conversión', 'Incidencias', 'Errores Sync'] : ['Sales', 'Conversion', 'Incidents', 'Sync Errors'],
                datasets: [{
                    label: '%',
                    data: [60, 18, -20, -30],
                    backgroundColor: chartColors.primaryGlow,
                    borderColor: chartColors.primary,
                    borderWidth: 1
                }]
            },
            options: {
                ...commonOptions,
                indexAxis: 'y'
            }
        });

        // Chart 3: Doughnut - ML Performance
        window.myCharts.c3 = new Chart(document.getElementById('chart3'), {
            type: 'doughnut',
            data: {
                labels: currentLang === 'es' ? ['Precisión', 'Margen Error'] : ['Accuracy', 'Error Rate'],
                datasets: [{
                    data: [72, 28],
                    backgroundColor: [chartColors.primary, chartColors.bg],
                    borderColor: chartColors.grid,
                    borderWidth: 1
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                cutout: '65%',
                color: chartColors.text,
                plugins: {
                    legend: { position: 'bottom', labels: { color: chartColors.text, font: { family: "'Share Tech Mono', monospace" } } }
                }
            },
            plugins: [{
                id: 'centerText',
                beforeDraw: function (chart) {
                    var width = chart.width, height = chart.height, ctx = chart.ctx;
                    ctx.restore();
                    var fontSize = (height / 114).toFixed(2);
                    ctx.font = "bold " + fontSize + "em 'Orbitron', sans-serif";
                    ctx.textBaseline = "middle";
                    ctx.fillStyle = chartColors.primary;
                    var text = "72%", textX = Math.round((width - ctx.measureText(text).width) / 2), textY = height / 2.3;
                    ctx.fillText(text, textX, textY);

                    ctx.font = (fontSize / 2) + "em 'Share Tech Mono', monospace";
                    ctx.fillStyle = chartColors.text;
                    var subText = currentLang === 'es' ? "Precisión" : "Accuracy";
                    var subTextX = Math.round((width - ctx.measureText(subText).width) / 2);
                    ctx.fillText(subText, subTextX, textY + 25);
                    ctx.save();
                }
            }]
        });
    }

    function updateChartsText(lang) {
        if (!window.myCharts.c1) return;

        window.myCharts.c1.data.labels = lang === 'es' ? ['Base manual', 'Tras auto PHP', 'Tras opt web'] : ['Manual Base', 'PHP Auto', 'Web Opt'];
        window.myCharts.c1.update();

        window.myCharts.c2.data.labels = lang === 'es' ? ['Ventas', 'Conversión', 'Incidencias', 'Errores Sync'] : ['Sales', 'Conversion', 'Incidents', 'Sync Errors'];
        window.myCharts.c2.update();

        window.myCharts.c3.data.labels = lang === 'es' ? ['Precisión', 'Margen Error'] : ['Accuracy', 'Error Rate'];
        window.myCharts.c3.update();
    }

    function renderKPICards(lang) {
        const kpiContainer = document.getElementById('kpi-cards');
        if (!kpiContainer) return;

        const kpiData = lang === 'es' ? [
            { number: "150+", label: "Audiencias judiciales gestionadas por mes", icon: "⚖" },
            { number: "16K+", label: "Registros analizados en proyectos de datos", icon: "📊" },
            { number: "5+", label: "Sitios e-commerce desarrollados", icon: "🛒" },
            { number: "95%", label: "Satisfacción de clientes en base a datos", icon: "✓" }
        ] : [
            { number: "150+", label: "Judicial audiences managed per month", icon: "⚖" },
            { number: "16K+", label: "Records analyzed in data projects", icon: "📊" },
            { number: "5+", label: "E-commerce sites developed & launched", icon: "🛒" },
            { number: "95%", label: "Client satisfaction based on ticket data", icon: "✓" }
        ];

        kpiContainer.innerHTML = kpiData.map(kpi => `
            <div class="kpi-card">
                <span class="kpi-icon">${kpi.icon}</span>
                <span class="kpi-number glitch-hover" data-text="${kpi.number}">${kpi.number}</span>
                <span class="kpi-label">${kpi.label}</span>
            </div>
        `).join('');
    }

    // Attach glitch hovers initial state
    function attachGlitchHovers() {
        const glitchHovers = document.querySelectorAll('.glitch-hover');
        glitchHovers.forEach(el => {
            // NUNCA clonar ni reemplazar tab-buttons ni sus hijos
            if (el.classList.contains('tab-btn')) return;
            if (el.closest && el.closest('.tab-btn')) return;
            if (el.closest && el.closest('.tabs-container')) return;

            // clear old listeners by replacing element
            const newEl = el.cloneNode(true);
            el.parentNode.replaceChild(newEl, el);

            newEl.addEventListener('mouseenter', () => {
                if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
                    newEl.classList.add('glitch');
                }
            });
            newEl.addEventListener('mouseleave', () => {
                newEl.classList.remove('glitch');
            });
        });
    }

    attachGlitchHovers();
});
