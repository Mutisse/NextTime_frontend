**Versionamento Semântico (SemVer)**.

### Estrutura de Versionamento Semântico

A versão semântica é composta por três números separados por pontos: **MAJOR.MINOR.PATCH**.

- **MAJOR (1)**: Indica uma versão principal.
- **MINOR (0)**: Indica a adição de novas funcionalidades.
- **PATCH (0)**: Indica correções de bugs.

No exemplo `"version": "1.0.0"`, temos:
- **MAJOR**: `1`
- **MINOR**: `0`
- **PATCH**: `0`

### Regras de Versionamento

1. **Mudança MAJOR (X.0.0)**:
   - O número MAJOR é incrementado quando há mudanças incompatíveis na API ou no comportamento do sistema. Essas mudanças são geralmente significativas e podem quebrar a compatibilidade com versões anteriores.
   - **Exemplo:** Se você tinha a versão `1.0.0` e fez uma mudança que altera como as funções principais do aplicativo funcionam de forma incompatível, você atualizaria para `2.0.0`.

2. **Mudança MINOR (1.X.0)**:
   - O número MINOR é incrementado quando você adiciona novas funcionalidades ao seu software de maneira compatível com versões anteriores. Ou seja, os novos recursos não afetam o funcionamento dos recursos antigos.
   - **Exemplo:** Se você adicionou um novo recurso sem quebrar nada do que já existia na versão `1.0.0`, você atualizaria para `1.1.0`.

3. **Mudança PATCH (1.0.X)**:
   - O número PATCH é incrementado quando você faz correções de bugs ou pequenas melhorias que não afetam as funcionalidades existentes. Essas mudanças são totalmente compatíveis com versões anteriores.
   - **Exemplo:** Se você corrigiu um erro na versão `1.0.0`, você atualizaria para `1.0.1`.

### Exemplos Práticos

- **De `1.0.0` para `1.1.0`**: Adicionou novas funcionalidades, mas manteve a compatibilidade com a versão anterior.
- **De `1.0.0` para `1.0.1`**: Fez pequenas correções ou melhorias, sem adicionar novos recursos.
- **De `1.0.0` para `2.0.0`**: Fez mudanças significativas que quebram a compatibilidade com a versão `1.x.x`.

### Importância do Versionamento Semântico
O versionamento semântico ajuda desenvolvedores e usuários a entender rapidamente a natureza das mudanças em uma nova versão do software.

- **Desenvolvedores:** Podem ajustar suas dependências e códigos de acordo com as mudanças na API.
- **Usuários:** Podem saber se uma atualização pode introduzir novos recursos, melhorias, ou se há o risco de quebrar algo que funcionava na versão anterior.

Essa convenção torna a manutenção e o desenvolvimento de software mais previsível e gerenciável.
