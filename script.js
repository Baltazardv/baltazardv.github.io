// Datos de proyectos
var projectsData = {
    videogames: {
        title: "Análisis de Factores de Éxito en Videojuegos",
        github: "https://github.com/Baltazardv/Ice-Online-Store",
        notebook: "https://nbviewer.org/github/Baltazardv/Ice-Online-Store/blob/main/Proyecto%20de%20An%C3%A1lisis%20de%20Datos%20%C3%89xito%20de%20Videojuegos%20para%20Ice%20Online%20Store.ipynb"
    },
    telecom: {
        title: "Identificación de Operadores Ineficaces — Telecom Analysis",
        github: "https://github.com/Baltazardv/telecom-operator-analysis",
        notebook: "https://nbviewer.org/github/Baltazardv/telecom-operator-analysis/blob/main/Proyecto_Final_Operadores_Ineficaces.ipynb"
    }
    // Aquí se añadirán más proyectos después
};

function openProject(projectId) {
    var project = projectsData[projectId];
    if (!project) return;

    document.getElementById('modal-title').textContent = project.title;
    document.getElementById('modal-github-link').href = project.github;
    document.getElementById('modal-iframe').src = project.notebook;
    document.getElementById('project-modal').classList.add('open');
    document.body.style.overflow = 'hidden';
}

function closeProject() {
    document.getElementById('project-modal').classList.remove('open');
    document.getElementById('modal-iframe').src = ''; // liberar memoria
    document.body.style.overflow = '';
}

// Cerrar con tecla Escape
document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') closeProject();
});

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

function toggleExp(id) {
    const panel = document.getElementById(id);
    const icon = document.getElementById(id + '-icon');
    if (!panel) return;
    const isOpen = panel.style.display !== 'none';
    panel.style.display = isOpen ? 'none' : 'block';
    if (icon) icon.textContent = isOpen ? '[ + ]' : '[ - ]';
}

// Fix 4 — Mobile skills accordion (desktop tabs unchanged)
function initMobileSkillsAccordion() {
    if (window.innerWidth > 768) {
        // Desktop: ensure all tab-contents are uncontrolled by this fn
        document.querySelectorAll('.tab-content').forEach(p => {
            p.style.maxHeight = '';
            p.style.overflow = '';
        });
        return;
    }
    const tabs = document.querySelectorAll('.tab-btn');
    const panels = document.querySelectorAll('.tab-content');
    if (!tabs.length) return;

    // Set initial state: close all, open active
    panels.forEach(p => {
        p.style.maxHeight = '0';
        p.style.overflow = 'hidden';
        p.classList.remove('active');
    });
    tabs.forEach(t => t.classList.remove('active'));

    // Find the currently active panel (from showTab state) or default to first
    const activePanel = document.querySelector('.tab-content.active') || panels[0];
    const activeIndex = Array.from(panels).indexOf(activePanel);
    if (activePanel) {
        activePanel.classList.add('active');
        activePanel.style.maxHeight = activePanel.scrollHeight + 'px';
        activePanel.style.overflow = 'visible';
    }
    if (tabs[activeIndex]) tabs[activeIndex].classList.add('active');

    // Attach click handlers (idempotent via flag)
    tabs.forEach((tab, i) => {
        if (tab._accordionBound) return;
        tab._accordionBound = true;
        tab.addEventListener('click', () => {
            if (window.innerWidth > 768) return;
            panels.forEach(p => {
                p.style.maxHeight = '0';
                p.style.overflow = 'hidden';
                p.classList.remove('active');
            });
            tabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');
            panels[i].classList.add('active');
            panels[i].style.maxHeight = panels[i].scrollHeight + 'px';
            setTimeout(() => { panels[i].style.overflow = 'visible'; }, 350);
        });
    });
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
            about_cred_2: "Certificación en Análisis de Datos (TripleTen) — 2026",
            about_profile: "> PERFIL:",
            about_profile_text: "Hace unos años gestionaba procesos técnicos en el sector judicial<br>y descubrí algo que cambió mi carrera: los datos contaban una<br>historia que nadie estaba escuchando.<br><br>Cada proceso que automaticé, cada incidencia que previne,<br>me mostró que detrás de cada número hay una decisión de negocio<br>esperando ser tomada.<br><br>Hoy combino Ingeniería en Computación con Análisis de Datos<br>para transformar métricas en acciones concretas — no solo<br>entiendo los datos, también entiendo los sistemas que los generan.",
            about_specialty: "> ESPECIALIDAD:",
            about_specialty_text: "eCommerce Analytics · Machine Learning · Business Intelligence<br>Python · SQL · Power BI · Google Analytics GA4",
            about_location: "> UBICACIÓN:",
            about_location_text: "Guerrero, México — Disponible para trabajo remoto.",
            skills_title: "02.<span class='glitch-hover' data-text='MIS_HABILIDADES'>MIS_HABILIDADES</span>",
            skills_subtitle: "// Herramientas con las que trabajo",
            tab_data: "[ DATOS Y BI ]",
            tab_db: "[ BASES DE DATOS ]",
            tab_web: "[ WEB Y DESARROLLO ]",
            tab_tools: "[ HERRAMIENTAS ]",
            impact_title: "05.<span class='glitch-hover' data-text='MI_IMPACTO'>MI_IMPACTO</span>",
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
            exp_title: "03.<span class='glitch-hover' data-text='EXPERIENCIA'>EXPERIENCIA</span>",
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
            impact_title: "05.<span class='glitch-hover' data-text='MY_IMPACT'>MY_IMPACT</span>",
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
            exp_title: "03.<span class='glitch-hover' data-text='WORK_EXPERIENCE'>WORK_EXPERIENCE</span>",
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
                labels: currentLang === 'es'
                    ? ['Proceso manual\n(base 100%)', 'App PHP v1\n(−40%)', 'PHP + opt. web\n(−75%)']
                    : ['Manual process\n(base 100%)', 'PHP App v1\n(−40%)', 'PHP + web opt\n(−75%)'],
                datasets: [{
                    label: currentLang === 'es' ? 'Tiempo relativo (%)' : 'Relative time (%)',
                    data: [100, 60, 25],
                    backgroundColor: chartColors.primaryGlow,
                    borderColor: chartColors.primary,
                    borderWidth: 1
                }]
            },
            options: {
                ...commonOptions,
                scales: {
                    x: { grid: { color: chartColors.grid }, ticks: { color: chartColors.text, font: { family: "'Share Tech Mono', monospace", size: 9 } } },
                    y: {
                        grid: { color: chartColors.grid },
                        ticks: { color: chartColors.text, font: { family: "'Share Tech Mono', monospace" }, callback: v => v + '%' },
                        min: 0, max: 110,
                        title: { display: true, text: currentLang === 'es' ? 'Tiempo relativo al proceso manual (%)' : 'Time relative to manual process (%)', color: chartColors.text, font: { family: "'Share Tech Mono', monospace", size: 9 } }
                    }
                }
            }
        });

        // Chart 2: Vertical Bar - Business Growth
        window.myCharts.c2 = new Chart(document.getElementById('chart2'), {
            type: 'bar',
            data: {
                labels: currentLang === 'es'
                    ? ['+60% Ventas\nPachateca', '+25% UX Score\nOK Latino', '−20% Incidencias\nInst. Judicial', '−40% T. Gestión\nInst. Judicial']
                    : ['+60% Sales\nPachateca', '+25% UX Score\nOK Latino', '−20% Incidents\nJud. Inst.', '−40% Op. Time\nJud. Inst.'],
                datasets: [{
                    label: currentLang === 'es' ? 'Variación vs. línea base (%)' : 'Change vs. baseline (%)',
                    data: [60, 25, -20, -40],
                    backgroundColor: function (ctx) {
                        return ctx.parsed.y >= 0 ? chartColors.primaryGlow : 'rgba(255,80,80,0.4)';
                    },
                    borderColor: function (ctx) {
                        return ctx.parsed.y >= 0 ? chartColors.primary : '#ff5050';
                    },
                    borderWidth: 1
                }]
            },
            options: {
                ...commonOptions,
                scales: {
                    x: { grid: { color: chartColors.grid }, ticks: { color: chartColors.text, font: { family: "'Share Tech Mono', monospace", size: 8 } } },
                    y: {
                        grid: { color: chartColors.grid },
                        ticks: { color: chartColors.text, font: { family: "'Share Tech Mono', monospace" }, callback: v => v + '%' },
                        min: -60,
                        max: 80,
                        title: { display: true, text: currentLang === 'es' ? 'Variación respecto a línea base (%)' : 'Change vs. prior baseline (%)', color: chartColors.text, font: { family: "'Share Tech Mono', monospace", size: 9 } }
                    }
                }
            }
        });

        // Chart 3: Doughnut - ML Performance
        window.myCharts.c3 = new Chart(document.getElementById('chart3'), {
            type: 'doughnut',
            data: {
                labels: currentLang === 'es'
                    ? ['72% Precisión alcanzada', '28% Margen de mejora identificado']
                    : ['72% Accuracy achieved', '28% Improvement margin'],
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
                    legend: { position: 'bottom', labels: { color: chartColors.text, font: { family: "'Share Tech Mono', monospace", size: 10 }, boxWidth: 12 } }
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
                    var text = "72%", textX = Math.round((width - ctx.measureText(text).width) / 2), textY = height / 2.5;
                    ctx.fillText(text, textX, textY);

                    ctx.font = (fontSize * 0.45) + "em 'Share Tech Mono', monospace";
                    ctx.fillStyle = chartColors.text;
                    var subText = currentLang === 'es' ? 'Precisión' : 'Accuracy';
                    var subTextX = Math.round((width - ctx.measureText(subText).width) / 2);
                    ctx.fillText(subText, subTextX, textY + 24);

                    ctx.font = (fontSize * 0.38) + "em 'Share Tech Mono', monospace";
                    ctx.fillStyle = 'rgba(246,246,246,0.45)';
                    var rf = 'Random Forest';
                    var rfX = Math.round((width - ctx.measureText(rf).width) / 2);
                    ctx.fillText(rf, rfX, textY + 40);
                    ctx.save();
                }
            }]
        });
    }

    function updateChartsText(lang) {
        if (!window.myCharts.c1) return;

        window.myCharts.c1.data.labels = lang === 'es'
            ? ['Proceso manual\n(base 100%)', 'App PHP v1\n(−40%)', 'PHP + opt. web\n(−75%)']
            : ['Manual process\n(base 100%)', 'PHP App v1\n(−40%)', 'PHP + web opt\n(−75%)'];
        window.myCharts.c1.data.datasets[0].label = lang === 'es' ? 'Tiempo relativo (%)' : 'Relative time (%)';
        window.myCharts.c1.options.scales.y.title.text = lang === 'es' ? 'Tiempo relativo al proceso manual (%)' : 'Time relative to manual process (%)';
        window.myCharts.c1.update();

        window.myCharts.c2.data.labels = lang === 'es'
            ? ['+60% Ventas\nPachateca', '+25% UX Score\nOK Latino', '−20% Incidencias\nInst. Judicial', '−40% T. Gestión\nInst. Judicial']
            : ['+60% Sales\nPachateca', '+25% UX Score\nOK Latino', '−20% Incidents\nJud. Inst.', '−40% Op. Time\nJud. Inst.'];
        window.myCharts.c2.data.datasets[0].label = lang === 'es' ? 'Variación vs. línea base (%)' : 'Change vs. baseline (%)';
        window.myCharts.c2.options.scales.y.title.text = lang === 'es' ? 'Variación respecto a línea base (%)' : 'Change vs. prior baseline (%)';
        window.myCharts.c2.update();

        window.myCharts.c3.data.labels = lang === 'es'
            ? ['72% Precisión alcanzada', '28% Margen de mejora identificado']
            : ['72% Accuracy achieved', '28% Improvement margin'];
        window.myCharts.c3.update();
    }

    function renderKPICards(lang) {
        const kpiContainer = document.getElementById('kpi-cards');
        if (!kpiContainer) return;

        const kpiData = lang === 'es' ? [
            { number: "150+", label: "Audiencias judiciales / mes", context: "Instituto Mejoramiento Judicial · 2022-2023", detail: "Sin una sola interrupción crítica registrada" },
            { number: "16K+", label: "Registros analizados", context: "Proyecto Ice Store · Video Game Analysis · 2025", detail: "EDA completo con Python, Pandas y Power BI" },
            { number: "5+", label: "Sitios e-commerce desarrollados", context: "OK Latino · 2025-Presente", detail: "Kings League, Otto Vacation Rentals y más" },
            { number: "95%", label: "Satisfacción de clientes", context: "Pachateca · Soporte TI · 2017-2020", detail: "Basado en +50 clientes semanales atendidos" }
        ] : [
            { number: "150+", label: "Judicial audiences / month", context: "Instituto Mejoramiento Judicial · 2022-2023", detail: "Zero critical interruptions recorded" },
            { number: "16K+", label: "Records analyzed", context: "Ice Store Project · Video Game Analysis · 2025", detail: "Full EDA with Python, Pandas & Power BI" },
            { number: "5+", label: "E-commerce sites developed", context: "OK Latino · 2025-Present", detail: "Kings League, Otto Vacation Rentals & more" },
            { number: "95%", label: "Client satisfaction rate", context: "Pachateca · IT Support · 2017-2020", detail: "Based on 50+ weekly clients served" }
        ];

        kpiContainer.innerHTML = kpiData.map(kpi => `
            <div class="kpi-card">
                <span class="kpi-number glitch-hover" data-text="${kpi.number}">${kpi.number}</span>
                <span class="kpi-label">${kpi.label}</span>
                <span class="kpi-context">${kpi.context}</span>
                <span class="kpi-detail">${kpi.detail}</span>
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

    // Fix 4 — Initialize mobile accordion for skills tabs
    initMobileSkillsAccordion();
});

// Fix 4 — Re-run on resize (handles orientation change)
window.addEventListener('resize', () => {
    initMobileSkillsAccordion();
});
