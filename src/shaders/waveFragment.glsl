precision mediump float;

varying vec3 FragPos;
varying vec3 Normal;

//uniform vec3 cameraPosition;
uniform vec3 lightPosition;
uniform vec3 lightColor;

void main() {
    float ambientStrength = 0.2;
    vec3 ambient = ambientStrength * lightColor;

    vec3 norm = normalize(Normal);
    vec3 lightDir = normalize(lightPosition - FragPos);
    float diff = max(dot(norm, lightDir), 0.0);
    vec3 diffuse = diff * lightColor;

    float specularStrength = 0.5;
    vec3 viewDir = normalize(cameraPosition - FragPos);
    vec3 reflectDir = reflect(-lightDir, norm);
    float spec = pow(max(dot(viewDir, reflectDir), 0.0), 32.0);
    vec3 specular = specularStrength * spec * lightColor;

    vec3 waterColor = vec3(0.0, 0.5, 0.8);

    vec3 result = (ambient + diffuse + specular) * waterColor;
    gl_FragColor = vec4(result, 0.8);
}