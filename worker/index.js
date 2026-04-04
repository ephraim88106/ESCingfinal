export default {
  async fetch(request, env) {
    // CORS preflight
    if (request.method === 'OPTIONS') {
      return new Response(null, {
        headers: corsHeaders(env),
      });
    }

    // POST only
    if (request.method !== 'POST') {
      return new Response('Method not allowed', { status: 405 });
    }

    try {
      const { message, branch } = await request.json();

      if (!message || typeof message !== 'string' || message.length > 500) {
        return new Response(JSON.stringify({ error: '잘못된 요청입니다.' }), {
          status: 400,
          headers: { ...corsHeaders(env), 'Content-Type': 'application/json' },
        });
      }

      const systemPrompt = `당신은 "${branch || '에브라임'}" 에브라임 프리미엄 스터디카페의 친절한 AI 안내 도우미입니다.

역할:
- 스터디카페 이용 관련 질문에 간결하고 친절하게 답변합니다.
- 이모지를 적절히 사용하여 친근한 톤을 유지합니다.
- 답변은 3-4문장 이내로 짧게 합니다.

에브라임 스터디카페 정보:
- 운영시간: 365일 24시간
- 지점: 계양직영점, 박촌역점, 부천상동점, 부천신중동점, 부평삼산점
- 일일이용권: 3시간 6,000원 ~ 12시간 13,000원
- 시간이용권: 30시간 50,000원 ~ 200시간 220,000원
- 기간권: 2주 90,000원 ~ 16주 530,000원
- 고정석: 2주 130,000원 ~ 16주 700,000원
- 사물함: 4주 10,000원 ~ 12주 28,000원
- Wi-Fi SSID: ephraim01~04
- 라운지: 프리미엄 원두커피, 티백, 스낵 무료 제공
- 프린터: 이용권 구매자 무료 (A4 용지 개인 지참)
- 스터디룸: 4인실 7,000원/시간, 6인실 10,000원/시간
- 불편접수 시 관리자에게 즉시 텔레그램 알림 전송, 익명 보장

답변할 수 없는 질문(스터디카페와 무관한 질문)에는 정중히 안내 범위 밖임을 알리고, 자세한 문의는 앱 내 "1:1 상세 문의" 메뉴를 이용하도록 안내하세요.`;

      const response = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': env.ANTHROPIC_API_KEY,
          'anthropic-version': '2023-06-01',
        },
        body: JSON.stringify({
          model: 'claude-haiku-4-5-20251001',
          max_tokens: 300,
          system: systemPrompt,
          messages: [{ role: 'user', content: message }],
        }),
      });

      if (!response.ok) {
        const errText = await response.text();
        console.error('Anthropic API error:', errText);
        return new Response(
          JSON.stringify({ error: '응답 생성에 실패했습니다. 잠시 후 다시 시도해 주세요.' }),
          { status: 502, headers: { ...corsHeaders(env), 'Content-Type': 'application/json' } }
        );
      }

      const data = await response.json();
      const reply = data.content?.[0]?.text || '죄송합니다, 응답을 생성하지 못했습니다.';

      return new Response(JSON.stringify({ reply }), {
        headers: { ...corsHeaders(env), 'Content-Type': 'application/json' },
      });
    } catch (err) {
      console.error('Worker error:', err);
      return new Response(
        JSON.stringify({ error: '서버 오류가 발생했습니다.' }),
        { status: 500, headers: { ...corsHeaders(env), 'Content-Type': 'application/json' } }
      );
    }
  },
};

function corsHeaders(env) {
  return {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
  };
}
