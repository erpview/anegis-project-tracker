/* =============================================
   ANEGIS WWW — Site Map (React Flow)
   Professional tree: auto-sized nodes, clean edges
   ============================================= */

function initSitemap() {
    const { useMemo, createElement: h } = React;
    const RF = window.ReactFlow;
    if (!RF) { console.error('ReactFlow not loaded'); return; }

    const ReactFlowComponent = RF.default || RF.ReactFlow || RF;
    const Background = RF.Background;
    const Controls = RF.Controls;
    const MiniMap = RF.MiniMap;
    const useNodesState = RF.useNodesState;
    const useEdgesState = RF.useEdgesState;
    const Position = RF.Position;
    const MarkerType = RF.MarkerType;

    // ─── Colors ───
    const C = {
        root: { bg: '#E8356D', text: '#fff', bd: '#E8356D' },
        home: { bg: '#3D1428', text: '#F9A8D4', bd: '#E8356D' },
        corobimy: { bg: '#2D1F5E', text: '#C4B5FD', bd: '#8B5CF6' },
        obszary: { bg: '#1E1145', text: '#A78BFA', bd: '#7C3AED' },
        microsoft: { bg: '#0C2D4A', text: '#7DD3FC', bd: '#0EA5E9' },
        autorskie: { bg: '#0D2E1F', text: '#6EE7B7', bd: '#10B981' },
        uslugi: { bg: '#2E2210', text: '#FDE68A', bd: '#F59E0B' },
        branze: { bg: '#2E1210', text: '#FDBA74', bd: '#F97316' },
        casestudies: { bg: '#3D1428', text: '#F9A8D4', bd: '#E8356D' },
        wiedza: { bg: '#1E1145', text: '#D8B4FE', bd: '#A855F7' },
        onas: { bg: '#0C2D4A', text: '#A5F3FC', bd: '#06B6D4' },
    };

    // Node width: big headers wider, leaf nodes sized to fit longest text
    const NODE_W_BIG = 180;
    const NODE_W = 200;   // wide enough for longest labels

    function ns(key, big) {
        const c = C[key] || C.onas;
        return {
            background: c.bg, color: c.text,
            border: '2px solid ' + c.bd,
            borderRadius: big ? '14px' : '8px',
            padding: big ? '10px 20px' : '6px 12px',
            fontSize: big ? '13px' : '11px',
            fontWeight: big ? '700' : '500',
            fontFamily: 'Inter, sans-serif',
            textAlign: 'center',
            boxShadow: '0 2px 12px ' + c.bd + '20',
            width: (big ? NODE_W_BIG : NODE_W) + 'px',
        };
    }

    function buildGraph() {
        const N = [], E = [];
        let _eid = 0;
        const eid = () => 'e' + (_eid++);

        function add(id, label, x, y, color, big) {
            N.push({
                id, data: { label }, position: { x, y }, style: ns(color, big),
                sourcePosition: Position.Bottom, targetPosition: Position.Top,
            });
        }
        function edge(s, t) {
            E.push({
                id: eid(), source: s, target: t, type: 'smoothstep',
                style: { stroke: '#2A2A3A', strokeWidth: 1.5 },
                markerEnd: { type: MarkerType.ArrowClosed, color: '#2A2A3A', width: 8, height: 8 },
            });
        }

        // ────────────────────────────────────
        // LAYOUT: Column-based. Each section gets
        // its own X column. Parents centered above.
        // All children connect DIRECTLY to parent,
        // not chained through each other.
        // ────────────────────────────────────

        const COL_W = 230;   // column width (node width + gap)
        const ROW_H = 50;    // row height

        // Column X positions (left-to-right)
        const cols = {};
        let cx = 0;
        function col(name, span = 1) { cols[name] = cx; cx += COL_W * span; return cols[name]; }

        const xHome = col('home');      // 0
        const xObszary = col('obszary');   // 230
        const xMicrosoft = col('microsoft'); // 460
        const xAutorskie = col('autorskie'); // 690
        const xUslugi = col('uslugi');    // 920
        const xBranze = col('branze');    // 1150
        const xCases = col('cases');     // 1380
        const xWiedza = col('wiedza', 2); // 1610 (Spans 2 columns for Eventy children split)
        const xOnas = col('onas');      // 2070

        // Center a node in its column
        const cx_ = (colX, span = 1) => colX + (COL_W * span - NODE_W) / 2;
        const cx_big = (colX, span = 1) => colX + (COL_W * span - NODE_W_BIG) / 2;

        // Y tiers
        const Y0 = 0;     // root
        const Y1 = 90;    // top-level pages
        const Y2 = 200;   // sub-sections (Obszary, Rozwiązania)
        const Y3 = 310;   // sub-sub headers (Microsoft, Autorskie)
        const Y4 = 400;   // leaf items

        // ─── ROOT ───
        // Center root over all columns
        const rootX = (xHome + xOnas + COL_W) / 2 - NODE_W_BIG / 2;
        add('root', '🌐  ANEGIS.COM', rootX, Y0, 'root', true);

        // ─── TOP-LEVEL PAGES ───
        // CO ROBIMY centered over Obszary + Microsoft + Autorskie
        const coX = (xObszary + xAutorskie + COL_W) / 2 - NODE_W_BIG / 2;

        add('home', 'HOMEPAGE', cx_big(xHome), Y1, 'home', true);
        add('co', 'CO ROBIMY', coX, Y1, 'corobimy', true);
        add('uslugi', 'USŁUGI', cx_big(xUslugi), Y1, 'uslugi', true);
        add('branze', 'BRANŻE', cx_big(xBranze), Y1, 'branze', true);
        add('cases', 'CASE STUDIES', cx_big(xCases), Y1, 'casestudies', true);
        add('wiedza', 'WIEDZA', cx_big(xWiedza, 2), Y1, 'wiedza', true);
        add('onas', 'O NAS', cx_big(xOnas), Y1, 'onas', true);

        ['home', 'co', 'uslugi', 'branze', 'cases', 'wiedza', 'onas'].forEach(id => edge('root', id));

        // ─── CO ROBIMY → OBSZARY + ROZWIĄZANIA ───
        add('obszary', 'OBSZARY', cx_big(xObszary), Y2, 'obszary', true);
        // ROZWIĄZANIA centered over Microsoft + Autorskie
        const rozwX = (xMicrosoft + xAutorskie + COL_W) / 2 - NODE_W_BIG / 2;
        add('rozw', 'ROZWIĄZANIA', rozwX, Y2, 'microsoft', true);
        edge('co', 'obszary');
        edge('co', 'rozw');

        // Obszary children — single column
        var obsz = [
            'Finanse i compliance', 'Produkcja i łańcuch dostaw',
            'Sprzedaż i obsługa klienta', 'Marketing',
            'Zarządzanie projektami', 'Zarządzanie kapitałem ludzkim',
            'Dane i analityka', 'Agenci AI',
        ];
        obsz.forEach((l, i) => {
            add('ob' + i, l, cx_(xObszary), Y3 + i * ROW_H, 'obszary', false);
            edge('obszary', 'ob' + i);
        });

        // ─── ROZWIĄZANIA → MICROSOFT + AUTORSKIE ───
        add('ms', 'MICROSOFT', cx_big(xMicrosoft), Y3, 'microsoft', true);
        add('aut', 'AUTORSKIE', cx_big(xAutorskie), Y3, 'autorskie', true);
        edge('rozw', 'ms');
        edge('rozw', 'aut');

        // Microsoft children — single column
        var msI = [
            'D365 Finance', 'D365 Supply Chain', 'D365 Sales',
            'D365 Customer Service', 'D365 Field Service',
            'D365 Customer Insights', 'D365 Project Operations',
            'D365 HR', 'Microsoft Fabric', 'Power Platform',
            'Power BI', 'Copilot Studio', 'Azure',
        ];
        msI.forEach((l, i) => {
            add('ms' + i, l, cx_(xMicrosoft), Y4 + i * ROW_H, 'microsoft', false);
            edge('ms', 'ms' + i);
        });

        // Autorskie children — single column
        var auI = [
            'Cost Allocation', 'Polish Localisation Pack', 'OPAA',
            'AGA', 'ADF', 'AMOS', 'AWM', 'ATM',
            'ANEGIS KSeF', 'ANEGIS JPK', 'AMS', 'AHH Banking',
        ];
        auI.forEach((l, i) => {
            add('au' + i, l, cx_(xAutorskie), Y4 + i * ROW_H, 'autorskie', false);
            edge('aut', 'au' + i);
        });

        // ─── USŁUGI children — single column ───
        var usl = [
            'Wdrożenie ERP', 'Doradztwo i planowanie',
            'Analiza przedwdrożeniowa', 'Analiza wdrożenia',
            'Diagnozy', 'Zarządzanie zmianą', 'Wdrożenie CRM',
            'Aktualizacja', 'Rollout', 'Rozszerzenia funkcjonalne',
            'Strategia danych', 'Wsparcie projektowe',
            'Opieka serwisowa', 'Szkolenia', 'Bodyleasing',
        ];
        usl.forEach((l, i) => {
            add('us' + i, l, cx_(xUslugi), Y2 + i * ROW_H, 'uslugi', false);
            edge('uslugi', 'us' + i);
        });

        // ─── BRANŻE children ───
        var brz = ['Produkcja', 'Handel i dystrybucja', 'Inżynieria', 'Usługi profesjonalne'];
        brz.forEach((l, i) => {
            add('br' + i, l, cx_(xBranze), Y2 + i * ROW_H, 'branze', false);
            edge('branze', 'br' + i);
        });

        // ─── CASE STUDIES children ───
        var casesArr = [
            'Wdrożenie w BUUK', 'Wdrożenie w Home&You', 'Wdrożenie w CTDI',
            'Wdrożenie w Eton Shirts', 'Wdrożenie w Exterion Media', 'Wdrożenie w Nicols',
            'Wdrożenie w New Yorker', 'Wdrożenie w NCC', 'Wdrożenie w S&P Polska',
            'Wdrożenie w Saller Polbau', 'Wdrożenie w OSTP Group', 'Wdrożenie w TERG',
            'Wdrożenie w WPP', 'Wdrożenie w Westfield'
        ];
        casesArr.forEach((l, i) => {
            add('cs' + i, l, cx_(xCases), Y2 + i * ROW_H, 'casestudies', false);
            edge('cases', 'cs' + i);
        });

        // ─── WIEDZA children ───
        // Artykuły, E-booki, Podcasty, Webinary — direct children
        var wie1 = ['Artykuły', 'E-booki', 'Podcasty', 'Webinary'];
        wie1.forEach((l, i) => {
            add('wi' + i, l, cx_(xWiedza, 2), Y2 + i * ROW_H, 'wiedza', false);
            edge('wiedza', 'wi' + i);
        });

        // Eventy — direct child of Wiedza, then its own children below it
        add('wi4', 'Eventy', cx_(xWiedza, 2), Y2 + 4 * ROW_H, 'wiedza', false);
        edge('wiedza', 'wi4');

        // Left branch (Column 1 of Wiedza)
        var wLeftX = xWiedza;
        add('ev_l1', 'D365 Kierunek AI', cx_(wLeftX), Y2 + 5 * ROW_H, 'wiedza', false);
        add('ev_l2', 'Digital Transformation Day', cx_(wLeftX), Y2 + 6 * ROW_H, 'wiedza', false);
        edge('wi4', 'ev_l1');
        edge('ev_l1', 'ev_l2');

        // Right branch (Column 2 of Wiedza)
        var wRightX = xWiedza + COL_W;
        add('ev_r1', 'DX Excellence', cx_(wRightX), Y2 + 5 * ROW_H, 'wiedza', false);
        add('ev_r2', 'ANEGIS We are changing', cx_(wRightX), Y2 + 6 * ROW_H, 'wiedza', false);
        edge('wi4', 'ev_r1');
        edge('ev_r1', 'ev_r2');

        // ─── O NAS children ───
        var on = ['Zespół', 'Partnerstwa', 'Kariera', 'Aktualności', 'Kontakt'];
        on.forEach((l, i) => {
            add('on' + i, l, cx_(xOnas), Y2 + i * ROW_H, 'onas', false);
            edge('onas', 'on' + i);
        });

        return { nodes: N, edges: E };
    }

    // ─── Component ───
    function SitemapFlow() {
        var graph = useMemo(function () { return buildGraph(); }, []);
        var nodesState = useNodesState(graph.nodes);
        var edgesState = useEdgesState(graph.edges);

        return h('div', { style: { width: '100%', height: '100%' } },
            h(ReactFlowComponent, {
                nodes: nodesState[0],
                edges: edgesState[0],
                onNodesChange: nodesState[2],
                onEdgesChange: edgesState[2],
                fitView: true,
                fitViewOptions: { padding: 0.1 },
                proOptions: { hideAttribution: true },
                minZoom: 0.08, maxZoom: 2.5,
                style: { background: '#0D0D14' },
                nodesDraggable: true,
                nodesConnectable: false,
            },
                h(Background, { color: '#1A1A24', gap: 30, size: 1.5, variant: 'dots' }),
                h(Controls, {
                    style: { background: '#1A1A24', border: '1px solid #2A2A35', borderRadius: '10px', overflow: 'hidden' },
                    showInteractive: false,
                }),
                h(MiniMap, {
                    nodeColor: function (n) { return (n.style && n.style.background) || '#1A1A24'; },
                    style: { background: '#1A1A24', border: '1px solid #2A2A35', borderRadius: '10px' },
                    maskColor: 'rgba(13,13,20,0.85)',
                })
            )
        );
    }

    var container = document.getElementById('sitemap-root');
    if (container) {
        var root = ReactDOM.createRoot(container);
        root.render(h(SitemapFlow));
    }
}

// ─── Lazy init on tab activation ───
document.addEventListener('DOMContentLoaded', function () {
    var done = false;
    var observer = new MutationObserver(function () {
        var el = document.getElementById('view-sitemap');
        if (el && el.classList.contains('active') && !done) {
            done = true;
            setTimeout(function () {
                if (typeof window.ReactFlow !== 'undefined') initSitemap();
                else console.error('ReactFlow not loaded');
            }, 150);
        }
    });
    var mc = document.querySelector('.main-content');
    if (mc) observer.observe(mc, { subtree: true, attributes: true, attributeFilter: ['class'] });
});
