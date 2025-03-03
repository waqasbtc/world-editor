import React from 'react';
import { FaTrash } from 'react-icons/fa';
import Tooltip from './Tooltip';
import { playUIClick } from '../Sound';

const BlockButton = ({ 
  blockType, 
  isSelected, 
  onSelect, 
  onDelete, 
  handleDragStart 
}) => {
  
  const getTextureUrl = (blockType) => {
    if (!blockType.textureUri || blockType.textureUri.includes('error.png')) {
      return './assets/blocks/error.png';
    }
    
    if (blockType.isCustom) {
      // Handle both base64 and filename cases
      return blockType.textureUri.startsWith('data:') ? 
        blockType.textureUri : 
        `/${blockType.textureUri}`;
    }
    return `/${blockType.textureUri}`;
  };

  const isMissingTexture = !blockType.textureUri || 
    blockType.textureUri.includes('error.png') || 
    blockType.hasMissingTexture ||
    (blockType.isMultiTexture && !blockType.sideTextures['+y']);

  return (
    <Tooltip text={blockType.name}>
      <button
        className={`block-button ${isSelected ? "selected" : ""}`}
        onClick={() => {
          if (isMissingTexture) {
            alert("Missing Texture! \n \nThis means the map has this block, but the texture hasn't been added yet. Please select a different block, or upload the correct texture of the same name.\n \nTexture Name: \"" + blockType.name + "\"");
            return;
          }
          onSelect(blockType);
          playUIClick();
        }}
        draggable={true}
        onDragStart={() => handleDragStart(blockType.id)}
      >
        {blockType.isCustom && (
          <div
            className="delete-button"
            onClick={(e) => {
              e.stopPropagation();
              playUIClick();
              onDelete(blockType);
            }}
          >
            <FaTrash />
          </div>
        )}
        <div
          className="block-preview"
          style={{
            backgroundImage: `url(${getTextureUrl(blockType.isMultiTexture 
              ? {...blockType, textureUri: blockType.sideTextures['+y'] || blockType.textureUri}
              : blockType)})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            imageRendering: "pixelated",
          }}
        />
        <div className="block-button-label">{blockType.name}</div>
        {isMissingTexture && (
          <div className="block-button-missing-texture">Missing Texture!</div>
        )}
      </button>
    </Tooltip>
  );
};

export default React.memo(BlockButton);

