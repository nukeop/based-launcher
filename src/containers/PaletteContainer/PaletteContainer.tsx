import { Palette } from "../../components/Palette/Palette";
import { usePaletteContainerProps } from "./PaletteContainer.hooks";

export const PaletteContainer: React.FC = () => {
  const {
    listRef,
    flags,
    filteredOptions,
    filterInput,
    setFilterInput,
    selectedItemIndex,
    setSelectedItemIndex,
  } = usePaletteContainerProps();

  return (
    <Palette
      options={filteredOptions}
      filterInputValue={filterInput}
      onFilterInputValueChange={setFilterInput}
      selectedItemIndex={selectedItemIndex}
      onSetSelectedItemIndex={setSelectedItemIndex}
      listRef={listRef}
      prefixLabel={flags?.inputPrefix}
    />
  );
};
