// https://thelig.ht/chladni/

let rgba = new RGBA(`void main(void) {

    const float PI = 3.14159265;
    vec2 p = (2.0 * gl_FragCoord.xy - resolution.xy) / resolution.y;

    vec4 s1 = vec4(1.0, 1.0, 1.0, 2.0);
    vec4 s2 = vec4(-4.0, 4.0, 4.0, 4.6);

    float tx = sin(time)*0.1; 
    float ty = cos(time)*0.1; 

    float a = mix(s1.x, s2.x, xy.x+tx);
    float b = mix(s1.y, s2.y, xy.x+tx);
    float n = mix(s1.z, s2.z, xy.y+ty);
    float m = mix(s1.w, s2.w, xy.y+ty);

    float max_amp = abs(a) + abs(b);
    float amp = a * sin(PI*n*p.x) * sin(PI*m*p.y) + b * sin(PI*m*p.x) * sin(PI*n*p.y);
    float col = 1.0 - smoothstep(abs(amp), 0.0, 0.1);
    gl_FragColor = vec4(vec3(col), 1.0);

}`, {uniforms: {xy: '2f'}});


addEventListener('mousemove', e => rgba.xy([e.x/innerWidth,e.y/innerHeight]))
