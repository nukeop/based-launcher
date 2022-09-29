import {
  InfoboxBangResponse,
  isEmptyBangResponse,
  isInfoboxBangResponse,
  isWidgetBangResponse,
} from "../../bangs/bangs";
import { BangsArea } from "../../components/BangsArea/BangsArea";
import { BangsEmptyState } from "../../components/BangsEmptyState/BangsEmptyState";
import { Infobox } from "../../components/Infobox/Infobox";
import { Palette } from "../../components/Palette/Palette";
import { useBangs } from "../../hooks/useBangs";
import { usePaletteContainerProps } from "./PaletteContainer.hooks";

export const PaletteContainer: React.FC = () => {
  const {
    listRef,
    flags,
    options,
    filterInput,
    setFilterInput,
    selectedItemIndex,
    setSelectedItemIndex,
  } = usePaletteContainerProps();

  const { bang, bangResponse, isLoading } = useBangs({ input: filterInput });

  return (
    <Palette
      options={options}
      filterInputValue={filterInput}
      onFilterInputValueChange={setFilterInput}
      selectedItemIndex={selectedItemIndex}
      onSetSelectedItemIndex={setSelectedItemIndex}
      listRef={listRef}
      prefixLabel={flags?.inputPrefix}
      itemSize={flags?.itemSize}
      itemSizeWithDescription={flags?.itemSizeWithDescription}
    >
      <BangsArea isEmpty={!Boolean(bang)} isLoading={isLoading}>
        {isInfoboxBangResponse(bangResponse) && <Infobox {...bangResponse} />}
        {isEmptyBangResponse(bangResponse) && <BangsEmptyState />}
        {isWidgetBangResponse(bangResponse) && <bangResponse.widget />}
      </BangsArea>
    </Palette>
  );
};
