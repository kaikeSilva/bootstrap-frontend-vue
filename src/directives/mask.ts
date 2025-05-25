import type { Directive } from 'vue'

interface MaskDirectiveOptions {
  value: string;
}

export const vMask: Directive<HTMLInputElement, string> = {
  mounted(el, binding) {
    const maskPattern = binding.value
    
    // Função simplificada para aplicar máscara
    const applyMask = (value: string, pattern: string): string => {
      // Remover todos os caracteres não numéricos
      const digits = value.replace(/\D/g, '')
      
      let result = ''
      let digitIndex = 0
      
      // Percorrer o padrão e substituir # por dígitos
      for (let i = 0; i < pattern.length && digitIndex < digits.length; i++) {
        if (pattern[i] === '#') {
          result += digits[digitIndex++]
        } else {
          result += pattern[i]
        }
      }
      
      return result
    }
    
    const updateValue = () => {
      const maskedValue = applyMask(el.value, maskPattern)
      if (el.value !== maskedValue) {
        el.value = maskedValue
      }
    }
    
    // Manipulador de input que evita loops infinitos
    const handleInput = (e: Event) => {
      const input = e.target as HTMLInputElement
      const cursorPos = input.selectionStart || 0
      const oldValue = input.value
      
      // Salvar a posição do cursor antes de aplicar a máscara
      const beforeCursor = oldValue.substring(0, cursorPos)
      const digitCountBeforeCursor = beforeCursor.replace(/\D/g, '').length
      
      // Aplicar a máscara
      const maskedValue = applyMask(input.value, maskPattern)
      if (oldValue !== maskedValue) {
        input.value = maskedValue
        
        // Atualizar o modelo
        input.dispatchEvent(new Event('change'))
        
        // Calcular a nova posição do cursor
        let newCursorPos = 0
        let digitCount = 0
        
        for (let i = 0; i < maskedValue.length; i++) {
          if (/\d/.test(maskedValue[i])) {
            digitCount++
          }
          
          if (digitCount > digitCountBeforeCursor) {
            break
          }
          
          newCursorPos = i + 1
        }
        
        // Restaurar a posição do cursor
        setTimeout(() => {
          input.setSelectionRange(newCursorPos, newCursorPos)
        }, 0)
      }
    }
    
    // Adicionar ouvintes de eventos
    el.addEventListener('input', handleInput)
    
    // Aplicar máscara ao valor inicial se existir
    if (el.value) {
      updateValue()
    }
  }
}
