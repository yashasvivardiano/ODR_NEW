'use client'

import { useState } from 'react'

interface FormattingToolbarProps {
  isVisible: boolean
  onClose: () => void
}

export default function FormattingToolbar({ isVisible, onClose }: FormattingToolbarProps) {
  const [fontFamily, setFontFamily] = useState('Arial')
  const [textSize, setTextSize] = useState('14px')
  const [textColor, setTextColor] = useState('#000000')
  const [alignment, setAlignment] = useState('left')
  const [showAlignmentDropdown, setShowAlignmentDropdown] = useState(false)

  const handleFontChange = (font: string) => {
    setFontFamily(font)
    alert(`Font changed to ${font}`)
  }

  const handleSizeChange = (size: string) => {
    setTextSize(size)
    alert(`Text size changed to ${size}`)
  }

  const handleColorChange = (color: string) => {
    setTextColor(color)
    alert(`Text color changed to ${color}`)
  }

  const handleAlignmentChange = (align: string) => {
    setAlignment(align)
    alert(`Text alignment changed to ${align}`)
  }

  const handleFormattingAction = (action: string) => {
    alert(`${action} formatting applied`)
  }

  const handleUndo = () => {
    alert('Undo action performed')
  }

  const handleRedo = () => {
    alert('Redo action performed')
  }

  const handleTextSizeClick = () => {
    alert('Text size options opened')
  }

  const handleBold = () => {
    alert('Bold formatting applied')
  }

  const handleItalic = () => {
    alert('Italic formatting applied')
  }

  const handleUnderline = () => {
    alert('Underline formatting applied')
  }

  const handleTextColorClick = () => {
    alert('Text color picker opened')
  }

  const handleBulletList = () => {
    alert('Bullet list formatting applied')
  }

  const handleNumberedList = () => {
    alert('Numbered list formatting applied')
  }

  if (!isVisible) return null

  return (
    <div className="absolute bottom-full left-0 mb-2 bg-white border border-gray-200 rounded-lg shadow-lg p-3 z-60 w-[580px]">
      <style jsx>{`
        select option {
          color: #000000 !important;
          background-color: white !important;
        }
        select option:hover {
          background-color: #f3f4f6 !important;
          color: #000000 !important;
        }
        select option:checked {
          background-color: #3b82f6 !important;
          color: white !important;
        }
        select {
          color: #000000 !important;
        }
        select optgroup {
          color: #000000 !important;
          background-color: white !important;
          font-weight: bold !important;
        }
        select optgroup option {
          color: #000000 !important;
          background-color: white !important;
        }
      `}</style>
      
      {/* Single Row - All Formatting Options */}
      <div className="flex items-center space-x-1 p-2 bg-gray-50 rounded-lg">
        {/* Undo/Redo */}
        <button 
          onClick={handleUndo}
          className="p-1.5 hover:bg-gray-200 rounded text-gray-600"
          title="Undo"
        >
          ↶
        </button>
        <button 
          onClick={handleRedo}
          className="p-1.5 hover:bg-gray-200 rounded text-gray-600"
          title="Redo"
        >
          ↷
        </button>
        
        <div className="w-px h-6 bg-gray-300"></div>

        {/* Font Selection */}
        <div className="flex items-center">
          <select
            value={fontFamily}
            onChange={(e) => handleFontChange(e.target.value)}
            className="text-sm border-0 bg-transparent focus:outline-none w-[80px] text-black font-medium"
          >
            <optgroup label="Sans Serif">
              <option value="Arial">Arial</option>
              <option value="Helvetica">Helvetica</option>
              <option value="Verdana">Verdana</option>
              <option value="Tahoma">Tahoma</option>
              <option value="Trebuchet MS">Trebuchet MS</option>
              <option value="Calibri">Calibri</option>
              <option value="Segoe UI">Segoe UI</option>
              <option value="Roboto">Roboto</option>
              <option value="Open Sans">Open Sans</option>
              <option value="Lato">Lato</option>
              <option value="Montserrat">Montserrat</option>
              <option value="Source Sans Pro">Source Sans Pro</option>
              <option value="Nunito">Nunito</option>
              <option value="Poppins">Poppins</option>
              <option value="Ubuntu">Ubuntu</option>
            </optgroup>
            <optgroup label="Serif">
              <option value="Times New Roman">Times New Roman</option>
              <option value="Georgia">Georgia</option>
              <option value="Palatino">Palatino</option>
              <option value="Garamond">Garamond</option>
              <option value="Book Antiqua">Book Antiqua</option>
              <option value="Times">Times</option>
              <option value="Baskerville">Baskerville</option>
              <option value="Playfair Display">Playfair Display</option>
              <option value="Merriweather">Merriweather</option>
              <option value="Lora">Lora</option>
              <option value="Crimson Text">Crimson Text</option>
              <option value="Libre Baskerville">Libre Baskerville</option>
            </optgroup>
            <optgroup label="Monospace">
              <option value="Courier New">Courier New</option>
              <option value="Monaco">Monaco</option>
              <option value="Consolas">Consolas</option>
              <option value="Lucida Console">Lucida Console</option>
              <option value="Source Code Pro">Source Code Pro</option>
              <option value="Fira Code">Fira Code</option>
              <option value="JetBrains Mono">JetBrains Mono</option>
              <option value="Inconsolata">Inconsolata</option>
            </optgroup>
            <optgroup label="Display">
              <option value="Impact">Impact</option>
              <option value="Comic Sans MS">Comic Sans MS</option>
              <option value="Papyrus">Papyrus</option>
              <option value="Chalkduster">Chalkduster</option>
              <option value="Brush Script MT">Brush Script MT</option>
              <option value="Lobster">Lobster</option>
              <option value="Pacifico">Pacifico</option>
              <option value="Dancing Script">Dancing Script</option>
              <option value="Great Vibes">Great Vibes</option>
              <option value="Satisfy">Satisfy</option>
            </optgroup>
            <optgroup label="Handwriting">
              <option value="Cursive">Cursive</option>
              <option value="Brush Script">Brush Script</option>
              <option value="Kalam">Kalam</option>
              <option value="Caveat">Caveat</option>
              <option value="Indie Flower">Indie Flower</option>
              <option value="Shadows Into Light">Shadows Into Light</option>
              <option value="Amatic SC">Amatic SC</option>
              <option value="Permanent Marker">Permanent Marker</option>
            </optgroup>
            <optgroup label="Decorative">
              <option value="Copperplate">Copperplate</option>
              <option value="Copperplate Gothic Light">Copperplate Gothic Light</option>
              <option value="Copperplate Gothic Bold">Copperplate Gothic Bold</option>
              <option value="Futura">Futura</option>
              <option value="Gill Sans">Gill Sans</option>
              <option value="Optima">Optima</option>
              <option value="Century Gothic">Century Gothic</option>
              <option value="Franklin Gothic Medium">Franklin Gothic Medium</option>
            </optgroup>
          </select>
        </div>

        <div className="w-px h-6 bg-gray-300"></div>

        {/* Text Size/Style */}
        <div className="flex items-center">
          <button 
            onClick={handleTextSizeClick}
            className="p-1.5 hover:bg-gray-200 rounded text-gray-600" 
            title="Text Size"
          >
            <div className="flex items-center">
              <span className="text-lg font-bold">T</span>
              <span className="text-sm ml-1">T</span>
              <span className="text-xs ml-1">▼</span>
            </div>
          </button>
        </div>

        <div className="w-px h-6 bg-gray-300"></div>

        {/* Basic Formatting */}
        <button 
          onClick={handleBold}
          className="p-1.5 hover:bg-gray-200 rounded font-bold text-gray-600"
          title="Bold"
        >
          B
        </button>
        <button 
          onClick={handleItalic}
          className="p-1.5 hover:bg-gray-200 rounded italic text-gray-600"
          title="Italic"
        >
          I
        </button>
        <button 
          onClick={handleUnderline}
          className="p-1.5 hover:bg-gray-200 rounded underline text-gray-600"
          title="Underline"
        >
          U
        </button>
        
        {/* Text Color */}
        <div className="relative">
          <button
            onClick={handleTextColorClick}
            className="p-1.5 hover:bg-gray-200 rounded text-gray-600"
            title="Text Color"
          >
            <div className="flex items-center">
              <span className="text-lg font-bold">A</span>
              <span className="text-xs ml-1">▼</span>
            </div>
          </button>
          <input
            type="color"
            value={textColor}
            onChange={(e) => handleColorChange(e.target.value)}
            className="absolute top-0 left-0 w-full h-full opacity-0 cursor-pointer"
            title="Choose text color"
          />
        </div>

        <div className="w-px h-6 bg-gray-300"></div>

        {/* Alignment Dropdown */}
        <div className="relative">
          <button 
            onClick={() => setShowAlignmentDropdown(!showAlignmentDropdown)}
            className={`p-1.5 hover:bg-gray-200 rounded text-gray-600 flex items-center space-x-1 ${showAlignmentDropdown ? 'bg-blue-100' : ''}`}
            title="Text Alignment"
          >
            {/* Current alignment icon */}
            <div className="flex flex-col space-y-0.5">
              {alignment === 'left' && (
                <>
                  <div className="w-4 h-0.5 bg-current"></div>
                  <div className="w-4 h-0.5 bg-current"></div>
                  <div className="w-4 h-0.5 bg-current"></div>
                  <div className="w-2 h-0.5 bg-current"></div>
                </>
              )}
              {alignment === 'center' && (
                <>
                  <div className="w-4 h-0.5 bg-current"></div>
                  <div className="w-2 h-0.5 bg-current mx-auto"></div>
                  <div className="w-2 h-0.5 bg-current mx-auto"></div>
                  <div className="w-4 h-0.5 bg-current"></div>
                </>
              )}
              {alignment === 'right' && (
                <>
                  <div className="w-4 h-0.5 bg-current"></div>
                  <div className="w-4 h-0.5 bg-current"></div>
                  <div className="w-4 h-0.5 bg-current"></div>
                  <div className="w-2 h-0.5 bg-current ml-auto"></div>
                </>
              )}
            </div>
            <span className="text-xs">▼</span>
          </button>
          
          {/* Alignment Dropdown Menu */}
          {showAlignmentDropdown && (
            <div className="absolute bottom-full right-0 mb-1 bg-white border border-gray-200 rounded shadow-lg p-1 z-70 w-[60px]">
              <div className="flex flex-col space-y-0.5">
                {/* Left Alignment */}
                <button 
                  onClick={() => {
                    handleAlignmentChange('left')
                    setShowAlignmentDropdown(false)
                  }}
                  className="p-1 hover:bg-gray-100 rounded text-gray-600 flex items-center justify-center"
                  title="Align Left"
                >
                  <div className="flex flex-col space-y-0.5">
                    <div className="w-3 h-0.5 bg-current"></div>
                    <div className="w-3 h-0.5 bg-current"></div>
                    <div className="w-3 h-0.5 bg-current"></div>
                    <div className="w-1.5 h-0.5 bg-current"></div>
                  </div>
                </button>
                
                {/* Center Alignment */}
                <button 
                  onClick={() => {
                    handleAlignmentChange('center')
                    setShowAlignmentDropdown(false)
                  }}
                  className="p-1 hover:bg-gray-100 rounded text-gray-600 flex items-center justify-center"
                  title="Align Center"
                >
                  <div className="flex flex-col space-y-0.5">
                    <div className="w-3 h-0.5 bg-current"></div>
                    <div className="w-1.5 h-0.5 bg-current mx-auto"></div>
                    <div className="w-1.5 h-0.5 bg-current mx-auto"></div>
                    <div className="w-3 h-0.5 bg-current"></div>
                  </div>
                </button>
                
                {/* Right Alignment */}
                <button 
                  onClick={() => {
                    handleAlignmentChange('right')
                    setShowAlignmentDropdown(false)
                  }}
                  className="p-1 hover:bg-gray-100 rounded text-gray-600 flex items-center justify-center"
                  title="Align Right"
                >
                  <div className="flex flex-col space-y-0.5">
                    <div className="w-3 h-0.5 bg-current"></div>
                    <div className="w-3 h-0.5 bg-current"></div>
                    <div className="w-3 h-0.5 bg-current"></div>
                    <div className="w-1.5 h-0.5 bg-current ml-auto"></div>
                  </div>
                </button>
              </div>
            </div>
          )}
        </div>

        <div className="w-px h-6 bg-gray-300"></div>

        {/* Lists */}
        <button 
          onClick={handleBulletList}
          className="p-1 hover:bg-gray-200 rounded text-gray-600"
          title="Bullet List"
        >
          <div className="flex flex-col space-y-0.5">
            <div className="flex items-center space-x-0.5">
              <div className="w-0.5 h-0.5 bg-current rounded-full"></div>
              <div className="w-2 h-0.5 bg-current"></div>
            </div>
            <div className="flex items-center space-x-0.5">
              <div className="w-0.5 h-0.5 bg-current rounded-full"></div>
              <div className="w-1.5 h-0.5 bg-current"></div>
            </div>
            <div className="flex items-center space-x-0.5">
              <div className="w-0.5 h-0.5 bg-current rounded-full"></div>
              <div className="w-3 h-0.5 bg-current"></div>
            </div>
          </div>
        </button>
        <button 
          onClick={handleNumberedList}
          className="p-1 hover:bg-gray-200 rounded text-gray-600"
          title="Numbered List"
        >
          <div className="flex flex-col space-y-0.5">
            <div className="flex items-center space-x-0.5">
              <span className="text-xs font-bold">1</span>
              <div className="w-2 h-0.5 bg-current"></div>
            </div>
            <div className="flex items-center space-x-0.5">
              <span className="text-xs font-bold">2</span>
              <div className="w-1.5 h-0.5 bg-current"></div>
            </div>
            <div className="flex items-center space-x-0.5">
              <span className="text-xs font-bold">3</span>
              <div className="w-3 h-0.5 bg-current"></div>
            </div>
          </div>
        </button>

      </div>
    </div>
  )
}